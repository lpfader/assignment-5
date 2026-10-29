import { Get, Route, Tags } from "tsoa";

@Route("books")
@Tags("Books")
export class BooksController {
  @Get("/")
  public async getBooks() {
    return [
      { id: 1, title: "Assignment 5 is working" }
    ];
  }
}
