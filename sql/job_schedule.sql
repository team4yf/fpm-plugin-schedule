DROP TABLE IF EXISTS `job_schedule`;
CREATE TABLE IF NOT EXISTS `job_schedule` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `delflag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除标示',
  `createAt` bigint(20) NOT NULL DEFAULT '0' COMMENT '数据创建时间戳',
  `updateAt` bigint(20) NOT NULL DEFAULT '0' COMMENT '数据更新时间戳',
  `name` varchar(200) DEFAULT NULL COMMENT '计划任务的名称，英文名',
  `cron` varchar(200) DEFAULT NULL COMMENT 'corn 表达式',
  `autorun` tinyint(1) DEFAULT '1' COMMENT '创建成功后，自动执行',
  `method` varchar(200) NOT NULL,
  `v` varchar(50) NOT NULL DEFAULT '0.0.1',
  `args` varchar(2000) NOT NULL DEFAULT '{}',
  `webhook` varchar(1000) NOT NULL,
  `job_type` varchar(20) NOT NULL DEFAULT 'BIZ' COMMENT '计划任务的类型，BIZ：内部业务类；WEB：HTTP 请求', 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='the schedule list';
INSERT INTO `job_schedule` (`id`, `delflag`, `createAt`, `updateAt`, `name`, `cron`, `autorun`, `method`, `v`, `args`, `webhook`, `job_type`) VALUES
(1, 0, 0, 0, 'demo', '* * * * *', 0, 'demo.foo', '0.0.1', '{\"message\":1}', 'http://localhost:9999/webhook/biz/execute/ops', 'BIZ'),
(2, 0, 0, 1550806670386, 'post local', '* * * * *', 0, 'http://localhost:9999/api', '0.0.1', '{}', 'http://localhost:9999/webhook/biz/execute/ops', 'WEB');
