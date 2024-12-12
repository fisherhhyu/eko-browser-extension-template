import { WebSearch } from "./tools/web_search";
import './eko'

setTimeout(async () => {
  // Test
  let search = new WebSearch()
  let result = await search.execute({ query: '谢扬', maxResults: 5 })
  console.log(result)
}, 2000)
