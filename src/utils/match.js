// 0 未通过审核 1 等待放款 2 逾期还款 3.部分还款 4.按时还款
const orderstatusMatch = [
  '',
  '申请中',
  '未审核',
  '审核未通过',
  '等待放款',
  '待还款',
  '部分还款',
  '按时完成还款',
  '逾期完成还款',
  '逾期未还款',
  '逾期部分还款',
  '展期',
  '审核失败'
];

const RESULTSUCCESS = 0;

export {
  orderstatusMatch,
  RESULTSUCCESS
};
