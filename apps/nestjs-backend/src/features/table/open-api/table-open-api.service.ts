import { Injectable } from '@nestjs/common';
import type { ICreateTableRo } from '@teable-group/core';
import { IdPrefix, generateTableId, OpBuilder } from '@teable-group/core';
import { PrismaService } from '../../../prisma.service';
import { ShareDbService } from '../../../share-db/share-db.service';
import { TransactionService } from '../../../share-db/transaction.service';

@Injectable()
export class TableOpenApiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shareDbService: ShareDbService,
    private readonly transactionService: TransactionService
  ) {}

  async createTable(tableRo: ICreateTableRo) {
    const result = await this.createTable2Ops(tableRo);
    const tableId = result.createSnapshot.table.id;
    await this.prismaService.$transaction(async (prisma) => {
      this.transactionService.set(tableId, prisma);
      try {
        await this.shareDbService.createDocument(
          `${IdPrefix.Table}_node`,
          tableId,
          result.createSnapshot
        );
      } finally {
        this.transactionService.remove(tableId);
      }
    });
    return result.createSnapshot.table;
  }

  private async createTable2Ops(tableRo: ICreateTableRo) {
    const tableAggregate = await this.prismaService.tableMeta.aggregate({
      _max: { order: true },
    });
    const tableId = generateTableId();
    const maxTableOrder = tableAggregate._max.order || 0;

    const createSnapshot = OpBuilder.creator.addTable.build(
      {
        ...tableRo,
        id: tableId,
      },
      maxTableOrder + 1
    );

    return {
      createSnapshot,
    };
  }
}