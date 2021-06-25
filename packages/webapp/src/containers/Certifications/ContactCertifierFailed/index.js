import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PureCertificationContactCertifierFailed from '../../../components/CertificationContactCertiferFailed';

function CertificationContactCertifierFailed({ history, match }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onExport = () => {
    // TODO: dispatch action and history push
    console.log('clicked export button');
  };

  return (
    <PureCertificationContactCertifierFailed
      onExport={onExport}
      handleGoBack={() => console.log('TODO: replace with proper goBack history push')}
      handleCancel={() => console.log('TODO: replace with proper cancel history push')}
    />
  );
}

export default CertificationContactCertifierFailed;
