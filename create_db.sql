CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `page_id` int(11) DEFAULT NULL,
  `page_url` varchar(255) DEFAULT NULL,
  `page_referrer` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `screen_resolution` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=3842 DEFAULT CHARSET=utf8;
