import { SearchRequest } from "../domain/model/SearchRequest";
import { Suggestion } from "../domain/model/Suggestion";

export class SearchPlanService {
  async search(request: SearchRequest): Promise<Suggestion> {
    void request;
    // TODO
    throw new Error("Method not implemented.");
  }
}
