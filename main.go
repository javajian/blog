package main

import (
	"blog/controllers"
	"blog/models"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/context"
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

func UrlManager(ctx *context.Context) {
	beego.Info(ctx.Request.RequestURI)
	uri := ctx.Request.RequestURI
	sess := controllers.GlobalSessions.SessionStart(ctx.Output.Context.ResponseWriter, ctx.Input.Request)
	defer sess.SessionRelease(ctx.Output.Context.ResponseWriter)
	onlineUser := sess.Get("online_user")
	beego.Info(onlineUser)

	if "/article/add" == uri {
		// 判断是否登录
		ajaxSign := ctx.Input.Header("X-Requested-With")
		if ajaxSign == "XMLHttpRequest" {
			beego.Info("ajax request")
			ctx.Output.Json(`{"login":"no"}`, false, false)
		} else {
			ctx.Redirect(302, "/user/login")
			beego.Info("document request")
		}
	} else {
		beego.Info("not need login")
	}

}

func main() {
	//初始化
	initialize()

	beego.Info(beego.AppName, APP_VER)

	if !controllers.IsPro {
		beego.SetStaticPath("/static_source", "static_source")
		beego.DirectoryIndex = true
	}

	beego.AddFilter("*", "AfterStatic", UrlManager)

	beego.Router("/", &controllers.MainController{})
	beego.Router("/user/reg", &controllers.UserController{}, "post:Reg")

	// Register template functions.
	beego.AddFuncMap("i18n", i18n.Tr)

	beego.Run()
}
