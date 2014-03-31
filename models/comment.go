package models

import (
	"time"
)

type Comment struct {
	Id      int64     //主键
	Content string    //内容
	Created time.Time //创建时间
	Uid     int64     //创建人
	Blog    int64     //评论的博客
}
