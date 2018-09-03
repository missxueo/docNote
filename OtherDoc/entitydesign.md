
# 小说实体设计

* entity book

field | fieldtype | comment
- | :-: | :-
id | int | 
title | string |
author | string | 
status | int | 


* entity catalog

field | fieldtype | comment
- | :-: | :-
id | int | 
bookid | int | 
index | int | 
title | string |
name | string |
source | string |
url | string | 

* entity chapter 

field | fieldtype | comment
- | :-: | -
id | int | 
bookid | int | 
catalogid | int | 
captureurl | string | 源地址
content | string |

* entity booksite

field | fieldtype | comment
- | :-: | -
id | int | 
name | string |
type | int | 0,capture site; 1,source site
url | string | 
catalog_regex | string | 
chapter_regex | string | 

