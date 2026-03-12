-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "paymentType" TEXT NOT NULL DEFAULT 'UNPAID',
    "agreedAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT NOT NULL DEFAULT '',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAttachment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_userId_idx" ON "Client"("userId");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- CreateIndex
CREATE INDEX "ProjectAttachment_userId_idx" ON "ProjectAttachment"("userId");

-- CreateIndex
CREATE INDEX "ProjectAttachment_projectId_idx" ON "ProjectAttachment"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectAttachment_storagePath_key" ON "ProjectAttachment"("storagePath");

-- AddForeignKey
ALTER TABLE "Project"
ADD CONSTRAINT "Project_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "Client"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAttachment"
ADD CONSTRAINT "ProjectAttachment_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
