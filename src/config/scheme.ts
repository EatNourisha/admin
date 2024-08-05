import * as yup from "yup";


export const createGiftCardScheme = yup.object().shape({
    name: yup.string().required("Please enter name of gift card"),
    subscription_interval: yup.string().required("Please enter subscription interval"),
    amount:yup.number().required("Please enter gift card amount")
});