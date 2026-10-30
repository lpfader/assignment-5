/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, KoaTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HelloController } from './../src/hello.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WarehouseController } from './../src/warehouse/warehouse.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrdersController } from './../src/orders/orders.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BooksController } from './../src/books/books.controller';
import type { Context, Next, Middleware, Request as KRequest, Response as KResponse } from 'koa';
import type * as KoaRouter from '@koa/router';


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ShelfId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ShelfStock": {
        "dataType": "refObject",
        "properties": {
            "shelf": {"ref":"ShelfId","required":true},
            "count": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PlaceBooksRequest": {
        "dataType": "refObject",
        "properties": {
            "bookId": {"dataType":"string","required":true},
            "numberOfBooks": {"dataType":"double","required":true},
            "shelf": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookStockResponse": {
        "dataType": "refObject",
        "properties": {
            "bookId": {"dataType":"string","required":true},
            "stock": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderResponse": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrderRequest": {
        "dataType": "refObject",
        "properties": {
            "books": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InvalidBookIdsResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"string","required":true},
            "invalidIds": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderBooks": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"dataType":"double"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrderResponse": {
        "dataType": "refObject",
        "properties": {
            "orderId": {"dataType":"string","required":true},
            "books": {"ref":"OrderBooks","required":true},
            "fulfilled": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FulfillmentResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookID": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FulfillmentItem": {
        "dataType": "refObject",
        "properties": {
            "book": {"ref":"BookID","required":true},
            "shelf": {"dataType":"string","required":true},
            "numberOfBooks": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FulfillmentRequest": {
        "dataType": "refObject",
        "properties": {
            "fulfillment": {"dataType":"array","array":{"dataType":"refObject","ref":"FulfillmentItem"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "author": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "image": {"dataType":"string","required":true},
            "stock": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateBookRequest": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "author": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "image": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new KoaTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


export function RegisterRoutes(router: KoaRouter) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


        const argsHelloController_sayHello: Record<string, TsoaRoute.ParameterSchema> = {
                name: {"in":"path","name":"name","required":true,"dataType":"string"},
        };
        router.get('/hello/:name',
            ...(fetchMiddlewares<Middleware>(HelloController)),
            ...(fetchMiddlewares<Middleware>(HelloController.prototype.sayHello)),

            async function HelloController_sayHello(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsHelloController_sayHello, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new HelloController();

            return templateService.apiHandler({
              methodName: 'sayHello',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWarehouseController_placeBooksOnShelf: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"PlaceBooksRequest"},
                badRequest: {"in":"res","name":"400","required":true,"ref":"ErrorResponse"},
        };
        router.post('/warehouse/shelves',
            ...(fetchMiddlewares<Middleware>(WarehouseController)),
            ...(fetchMiddlewares<Middleware>(WarehouseController.prototype.placeBooksOnShelf)),

            async function WarehouseController_placeBooksOnShelf(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseController_placeBooksOnShelf, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseController();

            return templateService.apiHandler({
              methodName: 'placeBooksOnShelf',
              controller,
              context,
              validatedArgs,
              successStatus: 201,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWarehouseController_getBookLocations: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        router.get('/warehouse/books/:bookId/locations',
            ...(fetchMiddlewares<Middleware>(WarehouseController)),
            ...(fetchMiddlewares<Middleware>(WarehouseController.prototype.getBookLocations)),

            async function WarehouseController_getBookLocations(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseController_getBookLocations, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseController();

            return templateService.apiHandler({
              methodName: 'getBookLocations',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWarehouseController_getBookStock: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
        };
        router.get('/warehouse/books/:bookId/stock',
            ...(fetchMiddlewares<Middleware>(WarehouseController)),
            ...(fetchMiddlewares<Middleware>(WarehouseController.prototype.getBookStock)),

            async function WarehouseController_getBookStock(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsWarehouseController_getBookStock, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new WarehouseController();

            return templateService.apiHandler({
              methodName: 'getBookStock',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersController_createOrder: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateOrderRequest"},
                badRequest: {"in":"res","name":"400","required":true,"dataType":"union","subSchemas":[{"ref":"ErrorResponse"},{"ref":"InvalidBookIdsResponse"}]},
        };
        router.post('/orders',
            ...(fetchMiddlewares<Middleware>(OrdersController)),
            ...(fetchMiddlewares<Middleware>(OrdersController.prototype.createOrder)),

            async function OrdersController_createOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersController_createOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersController();

            return templateService.apiHandler({
              methodName: 'createOrder',
              controller,
              context,
              validatedArgs,
              successStatus: 201,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersController_listOrders: Record<string, TsoaRoute.ParameterSchema> = {
                fulfilled: {"in":"query","name":"fulfilled","dataType":"boolean"},
        };
        router.get('/orders',
            ...(fetchMiddlewares<Middleware>(OrdersController)),
            ...(fetchMiddlewares<Middleware>(OrdersController.prototype.listOrders)),

            async function OrdersController_listOrders(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersController_listOrders, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersController();

            return templateService.apiHandler({
              methodName: 'listOrders',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersController_getOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                notFound: {"in":"res","name":"404","required":true,"ref":"ErrorResponse"},
        };
        router.get('/orders/:orderId',
            ...(fetchMiddlewares<Middleware>(OrdersController)),
            ...(fetchMiddlewares<Middleware>(OrdersController.prototype.getOrder)),

            async function OrdersController_getOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersController_getOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersController();

            return templateService.apiHandler({
              methodName: 'getOrder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsOrdersController_fulfillOrder: Record<string, TsoaRoute.ParameterSchema> = {
                orderId: {"in":"path","name":"orderId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"FulfillmentRequest"},
                notFound: {"in":"res","name":"404","required":true,"ref":"ErrorResponse"},
                badRequest: {"in":"res","name":"400","required":true,"ref":"ErrorResponse"},
        };
        router.post('/orders/:orderId/fulfill',
            ...(fetchMiddlewares<Middleware>(OrdersController)),
            ...(fetchMiddlewares<Middleware>(OrdersController.prototype.fulfillOrder)),

            async function OrdersController_fulfillOrder(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsOrdersController_fulfillOrder, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new OrdersController();

            return templateService.apiHandler({
              methodName: 'fulfillOrder',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksController_listBooks: Record<string, TsoaRoute.ParameterSchema> = {
                from: {"in":"query","name":"from","dataType":"double"},
                to: {"in":"query","name":"to","dataType":"double"},
                name: {"in":"query","name":"name","dataType":"string"},
                author: {"in":"query","name":"author","dataType":"string"},
        };
        router.get('/books',
            ...(fetchMiddlewares<Middleware>(BooksController)),
            ...(fetchMiddlewares<Middleware>(BooksController.prototype.listBooks)),

            async function BooksController_listBooks(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksController_listBooks, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksController();

            return templateService.apiHandler({
              methodName: 'listBooks',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksController_getBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                notFound: {"in":"res","name":"404","required":true,"ref":"ErrorResponse"},
        };
        router.get('/books/:bookId',
            ...(fetchMiddlewares<Middleware>(BooksController)),
            ...(fetchMiddlewares<Middleware>(BooksController.prototype.getBook)),

            async function BooksController_getBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksController_getBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksController();

            return templateService.apiHandler({
              methodName: 'getBook',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksController_createBook: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"CreateBookRequest"},
                badRequest: {"in":"res","name":"400","required":true,"ref":"ErrorResponse"},
        };
        router.post('/books',
            ...(fetchMiddlewares<Middleware>(BooksController)),
            ...(fetchMiddlewares<Middleware>(BooksController.prototype.createBook)),

            async function BooksController_createBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksController_createBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksController();

            return templateService.apiHandler({
              methodName: 'createBook',
              controller,
              context,
              validatedArgs,
              successStatus: 201,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBooksController_deleteBook: Record<string, TsoaRoute.ParameterSchema> = {
                bookId: {"in":"path","name":"bookId","required":true,"dataType":"string"},
                notFound: {"in":"res","name":"404","required":true,"ref":"ErrorResponse"},
        };
        router.delete('/books/:bookId',
            ...(fetchMiddlewares<Middleware>(BooksController)),
            ...(fetchMiddlewares<Middleware>(BooksController.prototype.deleteBook)),

            async function BooksController_deleteBook(context: Context, next: Next) {

            let validatedArgs: any[] = [];
            try {
              validatedArgs = templateService.getValidatedArgs({ args: argsBooksController_deleteBook, context, next });
            } catch (err) {
              const error = err as any;
              error.message ||= JSON.stringify({ fields: error.fields });
              context.status = error.status;
              context.throw(context.status, error.message, error);
            }

            const controller = new BooksController();

            return templateService.apiHandler({
              methodName: 'deleteBook',
              controller,
              context,
              validatedArgs,
              successStatus: undefined,
            });
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
