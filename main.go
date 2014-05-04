package main

import (
	"blog/controllers"
	"blog/models"
	"github.com/astaxie/beego"
	"github.com/beego/i18n"
	"os"
)

const (
	APP_VER = "0.1"
)

func initialize() {

	models.InitModels()

	// Set App version and log level.
	beego.AppName = models.Cfg.MustValue("beego", "app_name")
	beego.RunMode = models.Cfg.MustValue("beego", "run_mode")

	controllers.IsPro = beego.RunMode == "prod"
	if controllers.IsPro {
		beego.SetLevel(beego.LevelInfo)
		os.Mkdir("./log", os.ModePerm)
		beego.BeeLogger.SetLogger("file", `{"filename": "log/log"}`)
	}
	controllers.InitApp()
}

func main() {

	//初始化
	initialize()

	beego.Info(beego.AppName, APP_VER)

	if !controllers.IsPro {
		beego.SetStaticPath("/static_source", "static_source")
		beego.DirectoryIndex = true
	}

	beego.Router("/", &controllers.MainController{})
	beego.Router("/user/reg", &controllers.UserController{}, "post:Reg")

	// Register template functions.
	beego.AddFuncMap("i18n", i18n.Tr)

	beego.Run()
}
