import { WebSearch } from "./tools/web_search";
import "./eko";

function test_websearch(query: string) {
  setTimeout(async () => {
    let search = new WebSearch();
    let result = await search.execute({
      query,
      maxResults: 5,
    });
    console.log('result', result);
  }, 2000);
}

// Test WebSearch
// test_websearch("authing Yang Xie");
