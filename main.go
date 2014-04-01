package main

import (
	"blog/controllers"
	_ "blog/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	orm.RegisterDriver("mysql", orm.DR_MySQL)
	orm.RegisterDataBase("default", "mysql", "root:root@/blog?charset=utf8&loc=Asia%2FShanghai")
}

func main() {
	// 增加一行注释
	// 开启 ORM 调试模式
	orm.Debug = true
	// 自动建表
	orm.RunSyncdb("default", false, true)

	beego.Router("/", &controllers.UserController{})

	beego.Run()
}
