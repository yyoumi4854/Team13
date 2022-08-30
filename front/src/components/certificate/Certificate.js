import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import CertificateEditForm from "./CertificateEditForm";
import CertificateList from "./CertificateList";
import CertificateAddForm from "./CertificateAddForm";
import apis from "../../apis/apis";
import { CardContent, Title } from "../CategorySyled";

const Certificate = ({ isEditable, portfolioOwnerId }) => {
  const [certificates, setCertificates] = useState([]);
  const Api = apis.cerRepository;

  useEffect(() => {
    Api.getCertificates(portfolioOwnerId).then((res) => {
      setCertificates(res.data);
    });
  }, [portfolioOwnerId]);

  const dateFormat = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month >= 10 ? month : "0" + month;
    day = day >= 10 ? day : "0" + day;

    return date.getFullYear() + "-" + month + "-" + day;
  };

  // add certificate
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

  // certificate editmode
  const changeEditMode = (index) => {
    const newCertificate = [...certificates];
    newCertificate[index].isEditing = true;

    setCertificates(newCertificate);
  };

  //delete
  const deleteCertificate = async (certificateId) => {
    try {
      const res = await Api.deleteCertificateById(certificateId);
      const updateCertificate = res.data.certificates;
      setCertificates(updateCertificate);
    } catch (err) {
      console.log(err);
    }
  };

  // edit

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

  const cancelEdit = (index) => {
    const newCertificate = [...certificates];
    newCertificate[index] = { ...certificates[index], isEditing: false };
    setCertificates(newCertificate);
  };

  return (
    <Card className="mb-2">
      <CardContent>
        <Title>자격증</Title>
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
        </div>
        {isEditable && <CertificateAddForm addCertificate={addCertificate} />}
      </CardContent>
    </Card>
  );
};

export default Certificate;
