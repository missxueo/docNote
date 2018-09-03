
# 小说实体设计

* entity book

书本

field | fieldtype | comment
- | :-: | :-
id | int | 
title | string |
author | string | 
status | int | 


* entity catalog

目录

field | fieldtype | comment
- | :-: | :-
id | int | 
bookid | int | 
booksiteid | int | 
index | int | 
title | string | 标题
name | string | 章节名

* entity booksite

站点

field | fieldtype | comment
- | :-: | -
id | int | 
name | string |
catalog_regex | string | 
chapter_regex | string | 
search_url | string | 
search_regex | string | 
remark | string | 备注

* entity capture

捕获记录

field | fieldtype | comment
- | :-: | -
id | int | 
catalogid | int | 
bookid | int | 
booksiteid | int | 
url | string | 

* entity chapter 

章节名

field | fieldtype | comment
- | :-: | -
id | int | 
bookid | int | 
catalogid | int | 
captureid | int | 
content | string | 


