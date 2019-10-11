
DROP TABLE  IF EXISTS `ue_ztm_account`;
CREATE TABLE `ue_ztm_account` (
 `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
 `firstName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `lastName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
 `email` varchar(100) COLLATE utf8_unicode_ci UNIQUE NOT NULL,
 `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
 `agreement` TINYINT unsigned DEFAULT 0,
 `isAdmin` TINYINT unsigned DEFAULT 0,
 `created` datetime NOT NULL,
 `emailValidateToken` varchar(20) NOT NULL,
 `emailValidateTokenDateTime` datetime NOT NULL,
 `emailValidated` datetime DEFAULT NULL,
 `resetPasswordToken` varchar(20) DEFAULT NULL,
 `resetPasswordTokenDateTime` datetime DEFAULT NULL,
 `modified` datetime NOT NULL,
 PRIMARY KEY (`id`),
 INDEX(email(100),emailValidateToken)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

insert into `ue_ztm_account`
  (firstName, lastName, email, password, agreement, isAdmin, created, emailValidateToken, emailValidateTokenDateTime, emailValidated, modified)
  VALUES('Jon', 'Ferraiolo', 'JONEMAIL', 'JONPASSWORD', 1, 1, now(), 'x', now(), now(), now());

DROP TABLE  IF EXISTS `ue_ztm_progress`;
CREATE TABLE `ue_ztm_progress` (
  `userId` int(11) NOT NULL UNIQUE,
  `version` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `tasknum` int(11) NOT NULL,
  `step` int(11) NOT NULL,
  `modified` datetime NOT NULL,
 PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE  IF EXISTS `ue_ztm_profile_item`;
CREATE TABLE `ue_ztm_profile_item` (
  `subjectId` int(11) NOT NULL,
  `category` varchar(20) NOT NULL,
  `valueIndex` int(11) NOT NULL,
  `value` varchar(20000) NOT NULL,
  `modified` datetime NOT NULL,
 INDEX(subjectId,category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
