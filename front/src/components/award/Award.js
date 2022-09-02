import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import AwardEditForm from "./AwardEditForm";
import AwardList from "./AwardList";
import AwardAddForm from "./AwardAddForm";
import apis from "../../apis/apis";
import CardList from "../../assets/style/CardListSyled";

const Award = ({ isEditable, portfolioOwnerId }) => {
  const [awards, setAwards] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const Api = apis.awardRepository;

  // award list (api=> get)
  useEffect(() => {
    try {
      Api.getAwards(portfolioOwnerId).then((res) => {
        setAwards(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [portfolioOwnerId]);

  // award 추가 (api => post)
  const addAward = async (name, description) => {
    try {
      const res = await Api.createAward({ name, description });
      const updateAward = res.data.awards;
      setAwards(updateAward);
    } catch (err) {
      console.log(err);
    }
  };

  // 수정 모드 변경
  const changeEditMode = (index) => {
    const newAward = [...awards];
    newAward[index].isEditing = true;
    setAwards(newAward);
  };

  // award 삭제 (api => delete)
  const deleteAward = async (awardId) => {
    try {
      const res = await Api.deleteAwardById(awardId);
      const updateAward = res.data.awards;
      setAwards(updateAward);
    } catch (err) {
      console.log(err);
    }
  };

  // award 수정 (api => patch)
  const confirmEdit = async (index, changeData) => {
    try {
      const res = await Api.updateAward(changeData);
      const updateAward = res.data.awards;
      setAwards(updateAward);
    } catch (err) {
      console.log(err);
    }
  };

  //수정 취소
  const cancelEdit = (index) => {
    const newAward = [...awards];
    newAward[index].isEditing = false;
    setAwards(newAward);
  };

  return (
    <Card className="mb-3">
      <CardList>
        <div className="title">수상이력</div>

        <div>
          {awards &&
            awards.map((award, index) => {
              return award.isEditing ? (
                <AwardEditForm
                  key={award._id}
                  index={index}
                  award={award}
                  confirmEdit={confirmEdit}
                  cancelEdit={cancelEdit}
                />
              ) : (
                <AwardList
                  key={award._id}
                  index={index}
                  award={award}
                  changeEditMode={changeEditMode}
                  deleteAward={deleteAward}
                  isEditable={isEditable}
                />
              );
            })}
          <div className="text-center mt-4 mb-3">
            {isEditable && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => setIsAdding(true)}
              >
                +
              </button>
            )}
          </div>
        </div>
        {isEditable && (
          <AwardAddForm
            addAward={addAward}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        )}
      </CardList>
    </Card>
  );
};

export default Award;
