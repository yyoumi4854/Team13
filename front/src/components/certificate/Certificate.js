import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import CertificateEditForm from "./CertificateEditForm";
import CertificateList from "./CertificateList";
import CertificateAddForm from "./CertificateAddForm";
import apis from "../../apis/apis";
import CardList from "../../assets/style/CardListSyled";

const Certificate = ({ isEditable, portfolioOwnerId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const Api = apis.cerRepository;

  // certificate list (api=> get)
  useEffect(() => {
    try {
      Api.getCertificates(portfolioOwnerId).then((res) => {
        setCertificates(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  }, [portfolioOwnerId]);

  const dateFormat = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
  };

  // certificate 추가 (api => post)
  const addCertificate = async (newCertificate) => {
    const { date } = newCertificate;

    try {
      const res = await Api.createCertificate({
        ...newCertificate,
        date: dateFormat(date),
      });
      const updateCertificate = res.data.certificates;
      setCertificates(updateCertificate);
    } catch (err) {
      console.log(err);
    }
  };

  // 수정 모드 변경
  const changeEditMode = (index) => {
    const newCertificate = [...certificates];
    newCertificate[index].isEditing = true;
    setCertificates(newCertificate);
  };

  //certificate 삭제 (api => delete)
  const deleteCertificate = async (certificateId) => {
    try {
      const res = await Api.deleteCertificateById(certificateId);
      const updateCertificate = res.data.certificates;
      setCertificates(updateCertificate);
    } catch (err) {
      console.log(err);
    }
  };

  // certificate 수정 (api => patch)
  const confirmEdit = async (changeData) => {
    const { date } = changeData;

    try {
      const res = await Api.updateCertificate({
        ...changeData,
        date: dateFormat(date),
      });
      const updateCertificate = res.data.certificates;
      setCertificates(updateCertificate);
    } catch (err) {
      console.log(err);
    }
  };

  //수정 취소
  const cancelEdit = (index) => {
    const newCertificate = [...certificates];
    newCertificate[index] = { ...certificates[index], isEditing: false };
    setCertificates(newCertificate);
  };

  return (
    <Card className="mb-3">
      <CardList>
        <div className="title">자격증</div>
        <div>
          {certificates.length > 0 &&
            certificates.map((certificate, index) => {
              return certificate.isEditing ? (
                <CertificateEditForm
                  key={certificate._id}
                  index={index}
                  certificate={certificate}
                  confirmEdit={confirmEdit}
                  cancelEdit={cancelEdit}
                />
              ) : (
                <CertificateList
                  key={certificate._id}
                  index={index}
                  certificate={certificate}
                  changeEditMode={changeEditMode}
                  deleteCertificate={deleteCertificate}
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
          <CertificateAddForm
            addCertificate={addCertificate}
            isAdding={isAdding}
            setIsAdding={setIsAdding}
          />
        )}
      </CardList>
    </Card>
  );
};

export default Certificate;
