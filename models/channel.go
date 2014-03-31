package models

import (
	"time"
)

type Channel struct {
	Id      int64     //主键
	Scn     string    // 唯一的编号
	Pcsn    string    //上级编号
	Name    string    // 栏目名称
	Show    int       //展示位置 0首页 1..
	Created time.Time //创建时间
}
