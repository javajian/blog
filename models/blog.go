// blog.go

package models

import (
	"time"
)

type Blog struct {
	Id         int64     //主键
	Title      string    //标题
	Content    string    //内容
	Uid        int64     //作者
	Created    time.Time //创建时间
	Attachment string    // 附件
	Views      int       //浏览量
	Replys     int       //回复量,评论数
	State      int       //状态:0正常 1发表 2禁止发表 3删除
	Tag        string    // 标签 spring web java 等
	Channel    int64     // 所属栏目
}
