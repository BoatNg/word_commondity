```
CREATE TABLE `words` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `word_id` varchar(36) NOT NULL COMMENT '词id',
  `value` varchar(36) NOT NULL COMMENT '词',
  `translation` datetime DEFAULT NULL COMMENT '翻译',
  `pronounce` varchar(36) DEFAULT NULL COMMENT '发音',
  `pos` varchar(36) DEFAULT NULL COMMENT '词态',
  `word_group` varchar(36) DEFAULT NULL COMMENT '词组',
  `synonyms` varchar(36) DEFAULT NULL COMMENT '同义词',
  `cognate` varchar(36) DEFAULT NULL COMMENT '同根词',
  `example_sentence` varchar(36) COMMENT '例句',
  `created_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` varchar(36) NOT NULL COMMENT '用户id',
  `user_name` varchar(36) NOT NULL COMMENT '用户名字',
  `email` varchar(36) DEFAULT NULL COMMENT '邮箱',
  `is_verify` varchar(36) DEFAULT NULL COMMENT '是否验证',
  `created_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users_words` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` varchar(36) NOT NULL COMMENT '用户id',
  `word_id` varchar(36) DEFAULT NULL COMMENT '词id',
  `binding_time` datetime DEFAULT NULL COMMENT '绑定时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```