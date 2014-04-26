// 用户表结构

package models

import (
	"github.com/astaxie/beego/orm"
	"time"
)

func init() {
	orm.RegisterModel(new(User))
}

type User struct {
	Id          int64     // 主键
	Uname       string    `orm:"size(30);unique"` // 用户名
	Pwd         string    `orm:"size(30)"`        // 密码
	Mobile      string    `orm:"null;size(11)"`   //手机号
	Email       string    // 邮箱
	Real        string    `orm:"null;size(20)"`  // 真实姓名
	Nick        string    `orm:"null;size(20)"`  // 昵称
	Head        string    `orm:"null;size(100)"` // 头像图片地址
	Sex         int8      `orm:"null"`           // 性别 1男 2女 0其他
	Province    int64     `orm:"null"`           // 省
	City        int64     `orm:"null"`           // 市
	Town        int64     `orm:"null"`           // 县
	Sign        string    `orm:"null"`           // 个性签名
	Place       string    `orm:"null;size(255)"` // 注册位置
	Reged       time.Time // 注册时间
	Utype       int       // 用户类型0一般用户 1管理员
	LastLogined time.Time // 最后登陆时间
	LockStarted time.Time `orm:"null"` // 被锁定用户开始时间
	LockEnded   time.Time `orm:"null"` // 结束时间
	State       int       // 锁定or正常
	Score       int64     // 积分
	Lv          int       // 级别
	Exp         int       // 经验值
	Birth       time.Time `orm:type(date)` // 生日
}

func FindAllUsers() ([]*User, error) {
	o := orm.NewOrm()
	users := make([]*User, 0)

	qs := o.QueryTable("user")
	_, err := qs.All(&users)
	return users, err
}

func SaveUser(u *User) map[string]interface{} {
	result := make(map[string]interface{})
	o := orm.NewOrm()
	o.Insert(u)
	result["succ"] = "mysuc"
	return result
}
