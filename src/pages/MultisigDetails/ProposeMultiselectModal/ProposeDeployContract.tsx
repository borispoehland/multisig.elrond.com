import React, { useEffect } from "react";
import { Balance } from "@elrondnetwork/erdjs/out";
import {
  BigUIntValue,
  BytesValue,
} from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { FormikCheckbox, FormikInputField } from "helpers/formikFields";
import { MultisigDeployContract } from "types/MultisigDeployContract";

interface ProposeDeployContractType {
  handleChange: (proposal: MultisigDeployContract) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const ProposeDeployContract = ({
  handleChange,
  setSubmitDisabled,
}: ProposeDeployContractType) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required("Required").test(validateAmount),
    code: Yup.string().required("Required").test(validateCode),
    upgradeable: Yup.boolean(),
    payable: Yup.boolean(),
    readable: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      amount: 0,
      code: "",
      upgradeable: false,
      payable: false,
      readable: false,
    },
    onSubmit: () => {
      return;
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });
  const { touched, errors, values } = formik;

  const { amount, code, upgradeable, payable, readable } = values;

  useEffect(() => {
    setSubmitDisabled(true);
  }, []);

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    setSubmitDisabled(hasErrors);
  }, [errors]);

  function validateAmount(value?: string) {
    const amountNumeric = Number(value);
    return !isNaN(amountNumeric);
  }

  function validateCode(value?: string) {
    try {
      if (value == null) {
        return false;
      }
      BytesValue.fromHex(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  const getProposal = (): MultisigDeployContract | null => {
    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());
    const result = new MultisigDeployContract(amountParam, code);
    result.upgradeable = upgradeable;
    result.payable = payable;
    result.readable = readable;

    return result;
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  React.useEffect(() => {
    refreshProposal();
  }, [name, amount, code, upgradeable, payable, readable]);

  const codeError = touched.code && errors.code;
  const amountError = touched.amount && errors.amount;

  return (
    <div>
      <FormikInputField
        label={t("Amount")}
        name={"amount"}
        value={amount}
        error={amountError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />
      <FormikInputField
        label={t("Code")}
        name={"code"}
        value={code}
        as={"textarea"}
        error={codeError}
        handleChange={formik.handleChange}
        handleBlur={formik.handleBlur}
      />

      <FormikCheckbox
        label={t("Upgradeable")}
        name={"upgradeable"}
        checked={upgradeable}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t("Payable")}
        name={"payable"}
        checked={payable}
        handleChange={formik.handleChange}
      />
      <FormikCheckbox
        label={t("Readable")}
        name={"readable"}
        checked={readable}
        handleChange={formik.handleChange}
      />
    </div>
  );
};

export default ProposeDeployContract;
