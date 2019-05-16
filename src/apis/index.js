import http from 'config/request';

// 判断手机终端安卓orIOS
export const isIOS = () => {
  let u = navigator.userAgent;
  // let app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    return false;
  }
  if (isIOS) {
    return true;
  }
};
/**
 * 发送验证码
 * @param:{string} phoneNum 手机号
 * @param:{string} smsType 1 登录
 * @return: {sendStatus, sendMsg}
 */
export const sendMsg = (phoneNum, smsType = 1) =>
  http.post('/sms/sendMsg', { phoneNum, smsType });

/**
 * 登陆接口
 * @param:{string} phoneNum 手机号
 * @param:{string} code 验证码
 * @return: {token, authStatus， phoneNum， idNum， name}
 */
export const loginIn = (phoneNum, code) =>
  http.post('/login', { phoneNum, code });

/**
 * 产品查询
 * @return: {array}
 */
export const getProductList = () => http.post('/loan/productList');

/**
 * 身份认证OCR
 * @param:{string} facePic 身份证正面 base64
 * @param:{string} backPic 身份证反面 base64
 */
export const handleOCROCR = (facePic, backPic, productId) =>
  http.post('/member/ocr', { facePic, backPic, productId });

/**
 * 身份认证单面上传
 * @param:{string} facePic 身份证正面 base64
 * @param:{string} backPic 身份证反面 base64
 */
export const handleIdentityScan = formdata =>
  http.post('/member/identity-scan', formdata);

export const handleupload = formdata =>
  http.filepost('/member/upload-files', formdata);

export const handleOcrPrepare = formdata =>
  http.filepost('/member/ocr/prepare', formdata);

/**
 * 上传cor
 */
export const handleOcrResult = () => http.post('/member/ocr/result');

/**
 * 身份信息确认
 */
export const handleUserInfo = (
  idNum,
  name,
  issueDate,
  expiryDate,
  addr,
  birthDate
) =>
  http.post('/member/id-info/confirm', {
    idNum,
    name,
    issueDate,
    expiryDate,
    addr,
    birthDate
  });

/**
 * 身份信息确认
 */

export const queryUserInfo = () => http.post('/member/user-info/query');

/**
 * 个人基本信息添加
 */
export const setUserInfo = (idNum, name, loanFor, relatives) =>
  http.post('/member/addInfo', {
    idNum,
    name,
    loanFor,
    relatives
  });

/**
 * 预绑卡（发送验证码） 申请绑定银行卡
 */
export const preBindCard = (cardNo, name, phoneNum) =>
  http.post('/bank/preBindCard', {
    cardNo,
    name,
    phoneNum
  });

/**
 * 确认绑卡
 * @param:{string} validateCode 签约短信
 */
export const confirmCardMsg = (validateCode, cardNo, name, phoneNum) =>
  http.post('/bank/confirmCard', { validateCode, cardNo, name, phoneNum });

/**
 * 借款协议查询
 */
export const getProtocolList = () => http.post('/loan/protocolList');

/**
 * 借款协议确认
 */
export const protocolSure = (orderId, agreementtempId) =>
  http.post('/loan/protocolSure', { orderId, agreementtempId });

/**
 * 个人信息查询
 */
export const getUserInfo = () => http.post('/member/acct-info');

/**
 * 个人主页信息
 */
export const getUserHomeInfo = () => http.post('/member/home');

/**
 * 我的贷款信息查询
 */
export const getLoanList = () => http.post('/loan/list');

/**
 * 订单详情
 */
export const getOrderInfo = orderId => http.post('/loan/detail', { orderId });

/**
 * 银行卡查询
 */
export const getBankList = () => http.post('/bank/bank-card/list');

/**
 * 立即还款 (发送还款短信)
 */
export const handleRepayMes = (repayAmount, cardNo, cardIdx, orderId) =>
  http.post('/loan/prepay', {
    repayAmount,
    cardNo,
    cardIdx,
    orderId
  });

/**
 * 确认还款
 */
export const getRepayment = (verifyCode, payorderId) =>
  http.post('/loan/pay', { verifyCode, payorderId });

/**
 *借款协议查询(仅用于借款)
 */
export const loanAgreement = () => http.post('/agreement/for-loan');
/**
 *借款协议查询(仅用于借款)
 */
export const loginAgreement = () => http.post('/agreement/for-login');
/**
 *借款下单
 */
export const loanPerform = (
  agreementTempId,
  productId,
  loanPurpose,
  requestNo
) =>
  http.post('/loan/perform', {
    agreementTempId,
    productId,
    loanPurpose,
    requestNo
  });

/**
 *借款下单
 */
export const loanPostpone = (orderId, payAmount, verifyCode) =>
  http.post('/loan/postpone', { orderId, payAmount, verifyCode });

/**
 *借款下单信息
 */
export const loanPostDetail = productId =>
  http.post('/loan/product-detail', { productId });
