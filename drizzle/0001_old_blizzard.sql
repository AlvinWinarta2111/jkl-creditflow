CREATE TABLE `applicationAuditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`actorId` int,
	`action` varchar(80) NOT NULL,
	`fromStatus` varchar(40),
	`toStatus` varchar(40),
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationAuditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `applicationDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`documentType` enum('ktp','kk','spk','proof_of_down_payment','application_form','contract','po','signed_contract','signed_po') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileKey` text NOT NULL,
	`fileSize` int,
	`verificationStatus` enum('pending','verified','rejected') NOT NULL DEFAULT 'pending',
	`uploadedBy` int,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`verifiedAt` timestamp,
	CONSTRAINT `applicationDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationNumber` varchar(32) NOT NULL,
	`status` enum('draft','submitted','approved','docs_generated','signed_uploaded','disbursed','rejected') NOT NULL DEFAULT 'draft',
	`consumerName` varchar(160) NOT NULL,
	`nik` varchar(32) NOT NULL,
	`dateOfBirth` varchar(16),
	`maritalStatus` varchar(32),
	`spouseName` varchar(160),
	`dealer` varchar(160) NOT NULL,
	`vehicleBrand` varchar(80) NOT NULL,
	`vehicleModel` varchar(120) NOT NULL,
	`vehicleType` varchar(80),
	`vehicleColor` varchar(48),
	`vehiclePrice` decimal(14,2) NOT NULL,
	`downPayment` decimal(14,2),
	`tenorMonths` int NOT NULL,
	`monthlyInstallment` decimal(14,2),
	`insurance` varchar(100),
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`disbursedAt` timestamp,
	CONSTRAINT `creditApplications_id` PRIMARY KEY(`id`),
	CONSTRAINT `creditApplications_applicationNumber_unique` UNIQUE(`applicationNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','marketing','supervisor','backoffice') NOT NULL DEFAULT 'user';