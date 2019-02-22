DROP TABLE IF EXISTS `job_task`;
CREATE TABLE IF NOT EXISTS `job_task` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `delflag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除标示',
  `createAt` bigint(20) NOT NULL DEFAULT '0' COMMENT '数据创建时间戳',
  `updateAt` bigint(20) NOT NULL DEFAULT '0' COMMENT '数据更新时间戳',
  `status` varchar(200) DEFAULT 'TODO' COMMENT '任务执行状态。TODO：待执行，PENDING：执行中，DONE：完成，ERROR：异常结束，CANCEL：取消',
  `result` text COMMENT '任务执行的结果',
  `args` varchar(200) DEFAULT '{}' COMMENT '任务执行需要传入的参数，可以为空，JSON格式的字符串',
  `startAt` bigint(20) DEFAULT NULL COMMENT '任务开始时间',
  `finishAt` bigint(20) DEFAULT NULL COMMENT '任务开始时间',
  `error` text COMMENT '任务执行错误的内容',
  `schedule_id` bigint(20) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='the task of the schedule';