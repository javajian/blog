package models

import (
	"fmt"
	"github.com/Unknwon/com"
	"github.com/Unknwon/goconfig"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/toolbox"
	"os"
	"time"
)

const (
	_CFG_PATH = "conf/app.conf"
)

var Cfg *goconfig.ConfigFile

func InitModels() {
	if !com.IsFile(_CFG_PATH) {
		fmt.Println("app.ini文件不存在,创建..")
		os.Create(_CFG_PATH)
	}
	var err error
	Cfg, err = goconfig.LoadConfigFile(_CFG_PATH)
	if err == nil {
		beego.Info("Initialize app.conf")
	} else {
		fmt.Println(err)
		os.Exit(2)
	}

	// 添加一个定时任务
	task0 := toolbox.NewTask("first task", "0 */2 * * * *", firstTask)
	toolbox.AddTask("first task", task0)
	toolbox.StartTask()
	task1 := toolbox.NewTask("first task", "0 */1 * * * *", sendTask)
	toolbox.AddTask("send task", task1)
}

func firstTask() error {
	fmt.Println("task0: ", time.Now())
	return nil
}

func sendTask() error {
	fmt.Println("task1: ", time.Now())
	return nil
}
