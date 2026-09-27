@echo off
curl -X POST "https://watch-database1.p.rapidapi.com/search-watches-by-name" ^
  -H "content-type: application/x-www-form-urlencoded" ^
  -H "x-rapidapi-host: watch-database1.p.rapidapi.com" ^
  -H "x-rapidapi-key: dcf5c4a77dmsh88d1a157fdb88a9p176572jsn587cd318ec5e" ^
  -d "searchTerm=rolex&limit=1&page=1"
