"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureBlobModule = void 0;
const common_1 = require("@nestjs/common");
const azure_blob_services_1 = require("../../infrastructure/services/azure-blob.services");
let AzureBlobModule = class AzureBlobModule {
};
exports.AzureBlobModule = AzureBlobModule;
exports.AzureBlobModule = AzureBlobModule = __decorate([
    (0, common_1.Module)({
        providers: [azure_blob_services_1.AzureBlobService],
        exports: [azure_blob_services_1.AzureBlobService],
    })
], AzureBlobModule);
//# sourceMappingURL=azure-blob.module.js.map