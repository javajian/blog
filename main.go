package main

import (
	"blog/controllers"
	"blog/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"github.com/beego/i18n"
	_ "github.com/go-sql-driver/mysql"
	"os"
)

const (
	APP_VER = "0.1"
)

func initialize() {

	models.InitModels()

	// Set App version and log level.
	beego.AppName = models.Cfg.MustValue("beego", "appname")
	beego.RunMode = models.Cfg.MustValue("beego", "runmode")

	controllers.IsPro = beego.RunMode == "prod"
	if controllers.IsPro {
		beego.SetLevel(beego.LevelInfo)
		os.Mkdir("./log", os.ModePerm)
		beego.BeeLogger.SetLogger("file", `{"filename": "log/log"}`)
	}
	controllers.InitApp()
}

func init() {
	orm.RegisterDriver("mysql", orm.DR_MySQL)
	orm.RegisterDataBase("default", "mysql", "root:root@/blog?charset=utf8&loc=Asia%2FShanghai")
}

func main() {
	//初始化
	initialize()

	beego.Info(beego.AppName, APP_VER)

	// 开启 ORM 调试模式
	orm.Debug = true
	// 自动建表
	orm.RunSyncdb("default", false, true)

	beego.Router("/", &controllers.UserController{})

	// Register template functions.
	beego.AddFuncMap("i18n", i18n.Tr)

	beego.Run()
}
