---
title: "android根据银行卡卡号判断银行"
slug: "android-judge-the-bank-according-to-the-card-card-number-of-the-bank"
published: 2018-07-02T17:16:07+08:00
categories: [Android]
tags: [Android]
showToc: true
TocOpen: true
draft: false
---
根据银行卡号判断是哪个银行的卡，依据是银行卡号的前 6 位数，称之为 bin 号。
我们把 bin 号转化为长整形，再把各个银行卡的 bin 号做成有序表。通过二分查找的方法，找到 bin 号在有序表的位置，然后读出银行卡的信息。
<!--more-->
我把这个封装成一个 java 类，很简单的代码：
```java
public class BankInfo {
	//BIN 号
	private final static long[] bankBin=
	{
		102033,
		103000,
		185720,
		303781,
		356827,
		356828,
		356833,
		356835,
		356837,
		356838,
		356839,
		356840,
		356885,
		356886,
		356887,
		356888,
		356889,
		356890,
		370246,
		370247,
		370248,
		370249,
		400360,
		400937,
		400938,
		400939,
		400940,
		400941,
		400942,
		402658,
		402673,
		402791,
		403361,
		403391,
		404117,
		404157,
		404171,
		404172,
		404173,
		404174,
		404738,
		404739,
		405512,
		405512,
		406252,
		406254,
		406365,
		407405,
		409665,
		409666,
		409667,
		409668,
		409669,
		409670,
		409671,
		409672,
		410062,
		412962,
		412963,
		415599,
		421317,
		421349,
		421393,
		421437,
		421865,
		421869,
		421870,
		421871,
		422160,
		422161,
		424106,
		424107,
		424108,
		424109,
		424110,
		424111,
		424902,
		425862,
		427010,
		427018,
		427019,
		427020,
		427028,
		427029,
		427038,
		427039,
		427062,
		427064,
		427571,
		428911,
		431502,
		431502,
		433666,
		433670,
		433680,
		434061,
		434062,
		435744,
		435745,
		436718,
		436728,
		436738,
		436742,
		436745,
		436748,
		436768,
		438088,
		438125,
		438126,
		438588,
		438589,
		438600,
		439188,
		439225,
		439227,
		442729,
		442730,
		451289,
		451291,
		451804,
		451804,
		451810,
		451810,
		453242,
		456351,
		456418,
		458060,
		458060,
		458071,
		458071,
		458123,
		458124,
		468203,
		472067,
		472068,
		479228,
		479229,
		481699,
		486466,
		486493,
		486494,
		486497,
		487013,
		489592,
		489734,
		489735,
		489736,
		491020,
		491020,
		491031,
		491032,
		491040,
		493427,
		493878,
		498451,
		504923,
		510529,
		512315,
		512316,
		512411,
		512412,
		512425,
		512431,
		512466,
		512695,
		512732,
		514906,
		514957,
		514958,
		517636,
		518212,
		518364,
		518378,
		518379,
		518474,
		518475,
		518476,
		518710,
		518718,
		519412,
		519498,
		520082,
		520108,
		520131,
		520152,
		520169,
		520194,
		520382,
		521899,
		522153,
		523036,
		524011,
		524047,
		524070,
		524091,
		524094,
		524864,
		524865,
		525498,
		525745,
		525746,
		526410,
		526855,
		527414,
		528020,
		528931,
		528948,
		530970,
		530980,
		530980,
		530990,
		532420,
		532430,
		532450,
		532458,
		535910,
		535910,
		535918,
		537830,
		540297,
		540838,
		541068,
		541709,
		543159,
		544033,
		545619,
		545623,
		545947,
		547628,
		547648,
		547766,
		547766,
		548259,
		548844,
		552245,
		552288,
		552534,
		552587,
		552599,
		552742,
		552794,
		552801,
		552853,
		553131,
		553242,
		556610,
		556617,
		558360,
		558730,
		558808,
		558809,
		558868,
		558868,
		558894,
		558895,
		558916,
		566666,
		584016,
		601100,
		601101,
		601121,
		601122,
		601123,
		601124,
		601125,
		601126,
		601127,
		601128,
		601131,
		601136,
		601137,
		601138,
		601140,
		601142,
		601143,
		601144,
		601145,
		601146,
		601147,
		601148,
		601149,
		601174,
		601177,
		601178,
		601179,
		601186,
		601187,
		601188,
		601189,
		601382,
		601382,
		601428,
		601428,
		601428,
		601428,
		602907,
		602907,
		602969,
		602969,
		603128,
		603128,
		603367,
		603367,
		603445,
		603445,
		603506,
		603506,
		603601,
		603601,
		603601,
		603601,
		603601,
		603601,
		603602,
		603602,
		603694,
		603694,
		603708,
		603708,
		621021,
		621201,
		621977,
		621977,
		622126,
		622126,
		622127,
		622127,
		622127,
		622127,
		622128,
		622128,
		622129,
		622129,
		622131,
		622131,
		622132,
		622132,
		622133,
		622133,
		622134,
		622134,
		622135,
		622135,
		622136,
		622136,
		622137,
		622137,
		622138,
		622138,
		622139,
		622139,
		622140,
		622140,
		622141,
		622141,
		622143,
		622143,
		622146,
		622146,
		622147,
		622147,
		622148,
		622148,
		622149,
		622149,
		622150,
		622150,
		622151,
		622151,
		622152,
		622152,
		622153,
		622153,
		622154,
		622154,
		622155,
		622155,
		622156,
		622156,
		622165,
		622165,
		622166,
		622166,
		622168,
		622168,
		622169,
		622169,
		622178,
		622178,
		622179,
		622179,
		622184,
		622184,
		622188,
		622188,
		622199,
		622199,
		622200,
		622200,
		622202,
		622202,
		622203,
		622203,
		622208,
		622208,
		622210,
		622210,
		622211,
		622211,
		622212,
		622212,
		622213,
		622213,
		622214,
		622214,
		622215,
		622215,
		622220,
		622220,
		622225,
		622225,
		622230,
		622230,
		622235,
		622235,
		622240,
		622240,
		622245,
		622245,
		622250,
		622250,
		622251,
		622251,
		622252,
		622252,
		622253,
		622253,
		622254,
		622254,
		622258,
		622258,
		622259,
		622259,
		622260,
		622260,
		622261,
		622261,
		622280,
		622280,
		622291,
		622291,
		622292,
		622292,
		622301,
		622301,
		622302,
		622302,
		622303,
		622303,
		622305,
		622305,
		622307,
		622307,
		622308,
		622308,
		622310,
		622310,
		622311,
		622311,
		622312,
		622312,
		622316,
		622316,
		622318,
		622318,
		622319,
		622319,
		622321,
		622321,
		622322,
		622322,
		622323,
		622323,
		622324,
		622324,
		622325,
		622325,
		622327,
		622327,
		622328,
		622328,
		622329,
		622329,
		622331,
		622331,
		622332,
		622332,
		622333,
		622333,
		622335,
		622335,
		622336,
		622336,
		622337,
		622337,
		622338,
		622338,
		622339,
		622339,
		622340,
		622340,
		622341,
		622341,
		622342,
		622342,
		622343,
		622343,
		622345,
		622345,
		622346,
		622346,
		622347,
		622347,
		622348,
		622348,
		622349,
		622349,
		622350,
		622350,
		622351,
		622351,
		622352,
		622352,
		622353,
		622353,
		622355,
		622355,
		622358,
		622358,
		622359,
		622359,
		622360,
		622360,
		622361,
		622361,
		622362,
		622362,
		622363,
		622363,
		622365,
		622365,
		622366,
		622366,
		622367,
		622367,
		622368,
		622368,
		622369,
		622369,
		622370,
		622370,
		622371,
		622371,
		622373,
		622373,
		622375,
		622375,
		622376,
		622376,
		622377,
		622377,
		622378,
		622378,
		622379,
		622379,
		622382,
		622382,
		622383,
		622383,
		622384,
		622384,
		622385,
		622385,
		622386,
		622386,
		622387,
		622387,
		622388,
		622388,
		622389,
		622389,
		622391,
		622391,
		622392,
		622392,
		622393,
		622393,
		622394,
		622394,
		622395,
		622395,
		622396,
		622396,
		622397,
		622397,
		622398,
		622399,
		622399,
		622400,
		622400,
		622406,
		622406,
		622407,
		622407,
		622411,
		622411,
		622412,
		622412,
		622413,
		622413,
		622415,
		622415,
		622418,
		622418,
		622420,
		622420,
		622421,
		622421,
		622422,
		622422,
		622423,
		622423,
		622425,
		622425,
		622426,
		622426,
		622427,
		622427,
		622428,
		622428,
		622429,
		622429,
		622432,
		622432,
		622434,
		622434,
		622435,
		622435,
		622436,
		622436,
		622439,
		622439,
		622440,
		622440,
		622441,
		622441,
		622442,
		622442,
		622443,
		622443,
		622447,
		622447,
		622448,
		622448,
		622449,
		622449,
		622450,
		622450,
		622451,
		622451,
		622452,
		622452,
		622453,
		622453,
		622456,
		622456,
		622459,
		622459,
		622462,
		622462,
		622463,
		622463,
		622466,
		622466,
		622467,
		622467,
		622468,
		622468,
		622470,
		622470,
		622471,
		622471,
		622472,
		622472,
		622476,
		622476,
		622477,
		622477,
		622478,
		622478,
		622481,
		622481,
		622485,
		622485,
		622486,
		622486,
		622487,
		622487,
		622487,
		622487,
		622488,
		622488,
		622489,
		622489,
		622490,
		622490,
		622490,
		622490,
		622491,
		622491,
		622491,
		622491,
		622492,
		622492,
		622492,
		622492,
		622493,
		622493,
		622495,
		622495,
		622496,
		622496,
		622498,
		622498,
		622499,
		622499,
		622500,
		622500,
		622506,
		622506,
		622509,
		622509,
		622510,
		622510,
		622516,
		622516,
		622517,
		622517,
		622518,
		622518,
		622519,
		622519,
		622521,
		622521,
		622522,
		622522,
		622523,
		622523,
		622525,
		622525,
		622526,
		622526,
		622538,
		622538,
		622546,
		622546,
		622547,
		622547,
		622548,
		622548,
		622549,
		622549,
		622550,
		622550,
		622561,
		622561,
		622562,
		622562,
		622563,
		622563,
		622575,
		622575,
		622576,
		622576,
		622577,
		622577,
		622578,
		622578,
		622579,
		622579,
		622580,
		622580,
		622581,
		622581,
		622582,
		622582,
		622588,
		622588,
		622598,
		622598,
		622600,
		622600,
		622601,
		622601,
		622602,
		622602,
		622603,
		622603,
		622615,
		622615,
		622617,
		622617,
		622619,
		622619,
		622622,
		622622,
		622630,
		622630,
		622631,
		622631,
		622632,
		622632,
		622633,
		622633,
		622650,
		622650,
		622655,
		622655,
		622658,
		622658,
		622660,
		622660,
		622678,
		622678,
		622679,
		622679,
		622680,
		622680,
		622681,
		622681,
		622682,
		622682,
		622684,
		622684,
		622688,
		622688,
		622689,
		622689,
		622690,
		622690,
		622691,
		622691,
		622692,
		622692,
		622696,
		622696,
		622698,
		622698,
		622700,
		622700,
		622725,
		622725,
		622728,
		622728,
		622750,
		622750,
		622751,
		622751,
		622752,
		622752,
		622753,
		622753,
		622754,
		622755,
		622755,
		622756,
		622756,
		622757,
		622757,
		622758,
		622758,
		622759,
		622759,
		622760,
		622760,
		622761,
		622761,
		622762,
		622762,
		622763,
		622763,
		622770,
		622770,
		622777,
		622777,
		622821,
		622821,
		622822,
		622822,
		622823,
		622823,
		622824,
		622824,
		622825,
		622825,
		622826,
		622826,
		622827,
		622836,
		622836,
		622837,
		622837,
		622840,
		622840,
		622841,
		622842,
		622843,
		622844,
		622844,
		622845,
		622845,
		622846,
		622846,
		622847,
		622847,
		622848,
		622848,
		622849,
		622855,
		622855,
		622856,
		622856,
		622857,
		622857,
		622858,
		622858,
		622859,
		622859,
		622860,
		622860,
		622861,
		622861,
		622864,
		622864,
		622865,
		622865,
		622866,
		622866,
		622867,
		622867,
		622869,
		622869,
		622870,
		622870,
		622871,
		622871,
		622877,
		622877,
		622878,
		622878,
		622879,
		622879,
		622880,
		622880,
		622881,
		622881,
		622882,
		622882,
		622884,
		622884,
		622885,
		622885,
		622886,
		622886,
		622891,
		622891,
		622892,
		622892,
		622893,
		622893,
		622895,
		622895,
		622897,
		622897,
		622898,
		622898,
		622900,
		622900,
		622901,
		622901,
		622908,
		622908,
		622909,
		622909,
		622940,
		622982,
		628218,
		628288,
		628366,
		628368,
		650600,
		650600,
		650700,
		650700,
		650800,
		650800,
		650900,
		650900,
		682900,
		682900,
		683970,
		683970,
		685800,
		685800,
		685800,
		685800,
		685800,
		685800,
		690755,
		690755,
		690755,
		690755,
		694301,
		694301,
		695800,
		695800,
		843010,
		843010,
		843360,
		843360,
		843420,
		843420,
		843610,
		843610,
		843730,
		843730,
		843800,
		843800,
		843850,
		843850,
		843900,
		843900,
		870000,
		870000,
		870100,
		870100,
		870300,
		870300,
		870400,
		870400,
		870500,
		870500,
		888000,
		888000,
		940056,
		955880,
		955881,
		955882,
		955888,
		984301,
		998800,
};
	 //"发卡行。卡种名称", 
	private static final String[] bankName = {
		 "广东发展银行。广发理财通", 
		 "农业银行。金穗借记卡", 
		 "昆明农联社。金碧卡", 
		 "中国光大银行。阳光爱心卡", 
		 "上海银行。双币种申卡贷记卡个人金卡", 
		 "上海银行。双币种申卡贷记卡个人普卡", 
		 "中国银行。中银 JCB 卡金卡", 
		 "中国银行。中银 JCB 卡普卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "工商银行。牡丹运通卡金卡", 
		 "工商银行。牡丹运通卡普通卡", 
		 "中国工商银行。牡丹运通卡金卡", 
		 "中国工商银行。牡丹运通卡金卡", 
		 "中信实业银行。中信贷记卡", 
		 "中国银行。长城国际卡 (美元卡)-商务普卡", 
		 "中国银行。长城国际卡 (美元卡)-商务金卡", 
		 "中国银行。长城国际卡 (港币卡)-商务普卡", 
		 "中国银行。长城国际卡 (港币卡)-商务金卡", 
		 "中国银行。长城国际卡 (美元卡)-个人普卡", 
		 "中国银行。长城国际卡 (美元卡)-个人金卡", 
		 "招商银行。两地一卡通", 
		 "上海银行。申卡贷记卡", 
		 "工商银行。国际借记卡", 
		 "农业银行。金穗贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "农业银行。金穗贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "上海浦东发展银行。上海浦东发展银行信用卡 VISA 普通卡", 
		 "上海浦东发展银行。上海浦东发展银行信用卡 VISA 金卡", 
		 "交通银行。太平洋互连卡", 
		 "交通银行。太平洋互连卡", 
		 "中国光大银行。阳光信用卡", 
		 "中国光大银行。阳光信用卡", 
		 "广东发展银行。广发 VISA 信用卡", 
		 "民生银行。民生贷记卡", 
		 "中国银行。中银威士信用卡员工普卡", 
		 "中国银行。中银威士信用卡个人普卡", 
		 "中国银行。中银威士信用卡员工金卡", 
		 "中国银行。中银威士信用卡个人金卡", 
		 "中国银行。中银威士信用卡员工白金卡", 
		 "中国银行。中银威士信用卡个人白金卡", 
		 "中国银行。中银威士信用卡商务白金卡", 
		 "中国银行。长城公务卡", 
		 "招商银行银行。招商银行银行国际卡", 
		 "深圳发展银行。发展借记卡", 
		 "深圳发展银行。发展借记卡", 
		 "民生银行。民生借记卡", 
		 "北京银行。京卡双币种国际借记卡", 
		 "建设银行。乐当家银卡 VISA", 
		 "民生银行。民生国际卡", 
		 "中信实业银行。中信国际借记卡", 
		 "民生银行。民生国际卡", 
		 "民生银行。民生贷记卡", 
		 "民生银行。民生贷记卡", 
		 "民生银行。民生贷记卡", 
		 "北京银行。京卡贵宾金卡", 
		 "北京银行。京卡贵宾白金卡", 
		 "中国银行。长城人民币信用卡 - 个人金卡", 
		 "中国银行。长城人民币信用卡 - 员工金卡", 
		 "中国银行。长城人民币信用卡 - 个人普卡", 
		 "中国银行。长城人民币信用卡 - 员工普卡", 
		 "中国银行。长城人民币信用卡 - 单位普卡", 
		 "中国银行。长城人民币信用卡 - 单位金卡", 
		 "中国银行。长城国际卡 (美元卡)-白金卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。国际借记卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。国际借记卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "中国民生银行。民生国际借记卡", 
		 "广东发展银行。广发信用卡", 
		 "华夏。华夏卡", 
		 "华夏。华夏卡", 
		 "中信实业银行。中信贷记卡", 
		 "中信实业银行。中信借记卡", 
		 "中信实业银行。中信借记卡", 
		 "建设银行。乐当家金卡 VISA", 
		 "建设银行。乐当家白金卡 VISA", 
		 "深圳发展银行。沃尔玛百分卡", 
		 "深圳发展银行。沃尔玛百分卡", 
		 "建设银行。龙卡贷记卡公司卡金卡 VISA", 
		 "建设银行。龙卡普通卡 VISA", 
		 "建设银行。龙卡贷记卡公司卡普通卡 VISA", 
		 "建设银行。龙卡储蓄卡", 
		 "建设银行。龙卡国际普通卡 VISA", 
		 "建设银行。龙卡国际金卡 VISA", 
		 "广东发展银行。广发信用卡", 
		 "中国银行。中银奥运信用卡个人卡", 
		 "工商银行。牡丹 VISA 信用卡", 
		 "中国工商银行。牡丹 VISA 白金卡", 
		 "兴业银行。兴业智能卡", 
		 "兴业银行。兴业智能卡", 
		 "上海银行。上海申卡 IC", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行.VISA 信用卡", 
		 "招商银行.VISA 商务信用卡", 
		 "中信实业银行。中信国际借记卡", 
		 "中信实业银行。中信国际借记卡", 
		 "兴业银行.VISA 信用卡", 
		 "中国银行。长城国际卡 (欧元卡)-个人金卡", 
		 "工商银行。牡丹贷记卡", 
		 "工商银行。牡丹贷记卡", 
		 "工商银行。牡丹贷记卡", 
		 "工商银行。牡丹贷记卡", 
		 "建设银行.VISA 准贷记卡", 
		 "中国银行。长城电子借记卡", 
		 "上海浦东发展银行。浦发银行 VISA 年青卡", 
		 "工商银行。牡丹信用卡", 
		 "工商银行。牡丹信用卡", 
		 "工商银行。牡丹贷记卡", 
		 "工商银行。牡丹贷记卡", 
		 "交通银行。太平洋双币贷记卡 VISA", 
		 "交通银行。太平洋双币贷记卡 VISA", 
		 "招商银行。招商银行银行国际卡", 
		 "民生银行。民生国际卡", 
		 "民生银行。民生国际卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "中国光大银行。阳光白金信用卡", 
		 "上海银行。申卡贷记卡", 
		 "兴业银行.VISA 商务普卡", 
		 "兴业银行.VISA 商务金卡", 
		 "中国光大银行。阳光商旅信用卡", 
		 "广东发展银行。广发 VISA 信用卡", 
		 "中国建设银行.VISA 白金/钻石信用卡", 
		 "中国工商银行。牡丹欧元卡", 
		 "中国工商银行。牡丹欧元卡", 
		 "中国工商银行。牡丹欧元卡", 
		 "农业银行。金穗信用卡", 
		 "农业银行。金穗信用卡", 
		 "建设银行.VISA 准贷记金卡", 
		 "广东发展银行。广发信用卡", 
		 "交通银行。太平洋信用卡", 
		 "广东发展银行。广发信用卡", 
		 "中国银行。长城国际卡 (港币卡)-个人金卡", 
		 "上海浦东发展银行。上海浦东发展银行信用卡 VISA 白金卡", 
		 "常州商业银行。月季卡", 
		 "工商银行。牡丹万事达国际借记卡", 
		 "中国银行。中银万事达信用卡员工普卡", 
		 "中国银行。中银万事达信用卡个人普卡", 
		 "中国银行。中银万事达信用卡员工金卡", 
		 "中国银行。中银万事达信用卡个人金卡", 
		 "招商银行。招商银行银行国际卡", 
		 "宁波市商业银行。汇通国际卡", 
		 "民生银行。民生贷记卡", 
		 "中国银行。长城国际卡 (英镑卡)-个人普卡", 
		 "中国银行。长城国际卡 (英镑卡)-个人金卡", 
		 "中信实业银行。中信贷记卡", 
		 "中国银行。中银万事达信用卡员工白金卡", 
		 "中国银行。中银万事达信用卡个人白金卡", 
		 "民生银行。民生贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "广东发展银行。广发信用卡", 
		 "中国银行。长城人民币信用卡 - 个人金卡", 
		 "中国银行。长城人民币信用卡 - 员工金卡", 
		 "中国银行。长城人民币信用卡 - 专用卡普卡", 
		 "中国银行。长城人民币信用卡 - 员工普卡", 
		 "中国银行。长城人民币信用卡 - 个人普卡", 
		 "招商银行.MASTER 信用卡", 
		 "招商银行.MASTER 信用金卡", 
		 "农业银行。金穗贷记卡", 
		 "上海银行。双币种申卡贷记卡普通卡", 
		 "农业银行。金穗贷记卡", 
		 "中信实业银行。中信贷记卡", 
		 "上海银行。双币种申卡贷记卡金卡", 
		 "广东发展银行。广发万事达信用卡", 
		 "交通银行。太平洋双币贷记卡 MasterCard", 
		 "宁波市商业银行。汇通国际卡", 
		 "广东发展银行。广发万事达信用卡", 
		 "交通银行。太平洋双币贷记卡 MasterCard", 
		 "中国银行。长城国际卡 (欧元卡)-个人普卡", 
		 "兴业银行。万事达信用卡", 
		 "招商银行。招商银行银行国际卡", 
		 "工商银行。牡丹万事达白金卡", 
		 "兴业银行。万事达信用卡", 
		 "中国工商银行。牡丹海航信用卡个人金卡", 
		 "建设银行。乐当家金卡 MASTER", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国工商银行。牡丹海航信用卡个人普卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "建设银行。乐当家银卡 MASTER", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "兴业银行。加菲猫信用卡", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "广东发展银行。广发万事达信用卡", 
		 "民生银行。民生贷记卡", 
		 "工商银行。牡丹万事达信用卡", 
		 "工商银行。牡丹信用卡", 
		 "工商银行。牡丹信用卡", 
		 "工商银行。牡丹万事达信用卡", 
		 "建设银行.MASTER 准贷记卡", 
		 "建设银行。龙卡普通卡 MASTER", 
		 "建设银行。龙卡国际普通卡 MASTER", 
		 "建设银行。龙卡国际金卡 MASTER", 
		 "农业银行。金穗信用卡", 
		 "农业银行。金穗信用卡", 
		 "农业银行。金穗信用卡", 
		 "交通银行。太平洋信用卡", 
		 "中国银行。长城国际卡 (港币卡)-个人普卡", 
		 "中国银行。长城国际卡 (美元卡)-个人普卡", 
		 "中国银行。长城国际卡 (美元卡)-个人金卡", 
		 "广东发展银行。广发信用卡", 
		 "中国光大银行。第十八届世界足球锦标赛纪念卡", 
		 "建设银行.MASTER 准贷记金卡", 
		 "招商银行。万事达信用卡", 
		 "招商银行。万事达信用卡", 
		 "招商银行。万事达信用卡", 
		 "中国银行。长城国际卡 (美元卡)-商务普卡", 
		 "中国银行。长城国际卡 (港币卡)-商务普卡", 
		 "中国银行。长城人民币信用卡 - 单位普卡", 
		 "中国银行。长城万事达信用卡单位普卡", 
		 "工商银行。国际借记卡", 
		 "广东发展银行。广发信用卡", 
		 "建设银行。乐当家白金卡 MASTER", 
		 "民生银行。民生贷记卡", 
		 "招商银行。招商银行银行信用卡", 
		 "招商银行。招商银行银行信用卡", 
		 "农业银行。金穗贷记卡", 
		 "中国银行。长城公务卡", 
		 "广东发展银行。广发万事达信用卡", 
		 "建设银行。龙卡贷记卡公司卡普通卡 MASTER", 
		 "交通银行。太平洋双币贷记卡 MasterCard", 
		 "中国银行。长城公务卡", 
		 "建设银行。龙卡信用卡", 
		 "民生银行。民生贷记卡", 
		 "中信实业银行。中信 MASTERCARD 人民币 + 美金双币贷记卡", 
		 "工商银行。牡丹万事达信用卡", 
		 "农业银行。金穗贷记卡", 
		 "中国银行。长城国际卡 (港币卡)-商务金卡", 
		 "中国银行。长城国际卡 (美元卡)-商务金卡", 
		 "中国银行。长城人民币信用卡 - 单位金卡", 
		 "中国银行。中银万事达信用卡单位金卡", 
		 "广东发展银行。广发万事达信用卡", 
		 "建设银行。龙卡贷记卡公司卡金卡 MASTER", 
		 "中信实业银行。中信 MASTERCARD 人民币 + 美金双币贷记卡", 
		 "沈阳市商业银行。玫瑰卡", 
		 "深圳农联社。信通卡", 
		 "D.F.S.I(备注 1).发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "D.F.S.I.发现卡", 
		 "中国银行。长城电子借记卡", 
		 "中国银行。长城电子借记卡", 
		 "交通银行。太平洋万事顺卡", 
		 "交通银行。太平洋万事顺卡", 
		 "交通银行。太平洋万事顺卡", 
		 "交通银行。太平洋万事顺卡", 
		 "深圳商业银行。万事顺卡", 
		 "深圳商业银行。万事顺卡", 
		 "北京银行。京卡", 
		 "北京银行。京卡", 
		 "南京市商业银行。梅花卡", 
		 "南京市商业银行。梅花卡", 
		 "杭州商业银行。西湖卡", 
		 "杭州商业银行。西湖卡", 
		 "广州市商业银行。羊城借记卡", 
		 "广州市商业银行。羊城借记卡", 
		 "苏州市商业银行。姑苏卡", 
		 "苏州市商业银行。姑苏卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "徽商银行合肥分行。黄山卡", 
		 "绍兴商业银行。兰花卡", 
		 "绍兴商业银行。兰花卡", 
		 "常熟农村商业银行。粒金卡", 
		 "常熟农村商业银行。粒金卡", 
		 "大连商业银行。北方明珠卡", 
		 "大连商业银行。北方明珠卡", 
		 "河北省农村信用社。信通卡", 
		 "韩亚银行.", 
		 "温州商业银行。金鹿卡", 
		 "温州商业银行。金鹿卡", 
		 "阜新市商业银行。金通卡", 
		 "阜新市商业银行。金通卡", 
		 "福建省农村信用社联合社。万通", 
		 "厦门市农村信用合作社。万通卡", 
		 "福建省农村信用社联合社。万通", 
		 "厦门市农村信用合作社。万通卡", 
		 "深圳农信社。信通卡", 
		 "深圳农信社。信通卡", 
		 "深圳市农村信用合作社联合社。信通商务卡", 
		 "深圳市农村信用合作社联合社。信通商务卡", 
		 "淮安市商业银行。九州借记卡", 
		 "淮安市商业银行。九州借记卡", 
		 "嘉兴市商业银行。南湖借记卡", 
		 "嘉兴市商业银行。南湖借记卡", 
		 "贵阳市商业银行。甲秀银联借记卡", 
		 "贵阳市商业银行。甲秀银联借记卡", 
		 "重庆市商业银行。长江卡", 
		 "重庆市商业银行。长江卡", 
		 "成都商业银行。锦程卡", 
		 "成都商业银行。锦程卡", 
		 "西安市商业银行。福瑞卡", 
		 "西安市商业银行。福瑞卡", 
		 "徽商银行芜湖分行。黄山卡", 
		 "徽商银行芜湖分行。黄山卡", 
		 "北京农联社。信通卡", 
		 "北京农联社。信通卡", 
		 "兰州市商业银行。敦煌国际卡", 
		 "兰州市商业银行。敦煌国际卡", 
		 "廊坊市商业银行。银星卡", 
		 "廊坊市商业银行。银星卡", 
		 "泰隆城市信用社。泰隆卡", 
		 "泰隆城市信用社。泰隆卡", 
		 "乌鲁木齐市商业银行。雪莲借记卡", 
		 "乌鲁木齐市商业银行。雪莲借记卡", 
		 "青岛商行。金桥卡", 
		 "青岛商行。金桥卡", 
		 "呼市商业银行。百灵卡", 
		 "呼市商业银行。百灵卡", 
		 "上海银行。人民币申卡贷记卡金卡", 
		 "上海银行。人民币申卡贷记卡金卡", 
		 "上海银行。人民币申卡贷记卡普通卡", 
		 "上海银行。人民币申卡贷记卡普通卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "成都市商业银行。锦程卡金卡", 
		 "成都市商业银行。锦程卡金卡", 
		 "成都市商业银行。锦程卡定活一卡通金卡", 
		 "成都市商业银行。锦程卡定活一卡通金卡", 
		 "成都市商业银行。锦程卡定活一卡通", 
		 "成都市商业银行。锦程卡定活一卡通", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "深圳市商业银行。深圳市商业银行信用卡", 
		 "包头市商业银行。包头市商业银行借记卡", 
		 "包头市商业银行。包头市商业银行借记卡", 
		 "中国建设银行。龙卡人民币信用卡", 
		 "中国建设银行。龙卡人民币信用卡", 
		 "中国建设银行。龙卡人民币信用金卡", 
		 "中国建设银行。龙卡人民币信用金卡", 
		 "湖南省农村信用社联合社。福祥借记卡", 
		 "湖南省农村信用社联合社。福祥借记卡", 
		 "吉林市商业银行。信用卡", 
		 "吉林市商业银行。信用卡", 
		 "吉林市商业银行。信用卡", 
		 "吉林市商业银行。信用卡", 
		 "福建省农村信用社联合社。万通", 
		 "福建省农村信用社联合社。万通", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "国家邮政局。绿卡银联标准卡", 
		 "中国工商银行。灵通卡", 
		 "中国工商银行。灵通卡", 
		 "中国工商银行.E 时代卡", 
		 "中国工商银行.E 时代卡", 
		 "中国工商银行.E 时代卡", 
		 "中国工商银行.E 时代卡", 
		 "中国工商银行。理财金卡", 
		 "中国工商银行。理财金卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。准贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "中国工商银行。贷记卡", 
		 "交通银行股份有限公司太平洋双币信用卡中心。太平洋人民币贷记卡", 
		 "交行太平洋卡中心。太平洋人民币贷记卡", 
		 "交通银行股份有限公司太平洋双币信用卡中心。太平洋人民币贷记卡", 
		 "交行太平洋卡中心。太平洋人民币贷记卡", 
		 "交通银行股份有限公司太平洋双币信用卡中心。太平洋人民币贷记卡", 
		 "交行太平洋卡中心。太平洋人民币贷记卡", 
		 "交通银行股份有限公司太平洋双币信用卡中心。太平洋人民币贷记卡", 
		 "交行太平洋卡中心。太平洋人民币贷记卡", 
		 "交通银行。太平洋人民币准贷记卡", 
		 "交通银行。太平洋人民币准贷记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "交通银行。太平洋人民币借记卡", 
		 "建设银行.622280 银联储蓄卡", 
		 "建设银行.622280 银联储蓄卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "湖州市商业银行。百合卡", 
		 "湖州市商业银行。百合卡", 
		 "佛山市禅城区农村信用联社。信通卡", 
		 "佛山市禅城区农村信用联社。信通卡", 
		 "南京市商业银行。梅花贷记卡", 
		 "南京市商业银行。梅花贷记卡", 
		 "南京市商业银行。梅花借记卡", 
		 "南京市商业银行。梅花借记卡", 
		 "九江市商业银行。庐山卡", 
		 "九江市商业银行。庐山卡", 
		 "昆明商业银行。春城卡", 
		 "昆明商业银行。春城卡", 
		 "西宁市商业银行。三江银行卡", 
		 "西宁市商业银行。三江银行卡", 
		 "淄博市商业银行。金达借记卡", 
		 "淄博市商业银行。金达借记卡", 
		 "徐州市郊农村信用合作联社。信通卡", 
		 "徐州市郊农村信用合作联社。信通卡", 
		 "宁波市商业银行。汇通卡", 
		 "宁波市商业银行。汇通卡", 
		 "宁波市商业银行。汇通卡", 
		 "宁波市商业银行。汇通卡", 
		 "山东农村信用联合社。信通卡", 
		 "山东农村信用联合社。信通卡", 
		 "台州市商业银行。大唐贷记卡", 
		 "台州市商业银行。大唐贷记卡", 
		 "顺德农信社。恒通卡", 
		 "顺德农信社。恒通卡", 
		 "常熟农村商业银行。粒金借记卡", 
		 "常熟农村商业银行。粒金借记卡", 
		 "江苏农信。圆鼎卡", 
		 "江苏农信。圆鼎卡", 
		 "武汉市商业银行。九通卡", 
		 "武汉市商业银行。九通卡", 
		 "徽商银行马鞍山分行。黄山卡", 
		 "徽商银行马鞍山分行。黄山卡", 
		 "东莞农村信用合作社。信通卡", 
		 "东莞农村信用合作社。信通卡", 
		 "天津市农村信用社。信通借记卡", 
		 "天津市农村信用社。信通借记卡", 
		 "天津市商业银行。津卡", 
		 "天津市商业银行。津卡", 
		 "张家港市农村商业银行。一卡通", 
		 "张家港市农村商业银行。一卡通", 
		 "东莞市商业银行。万顺通卡", 
		 "东莞市商业银行。万顺通卡", 
		 "南宁市商业银行。桂花卡", 
		 "南宁市商业银行。桂花卡", 
		 "包头市商业银行。雄鹰卡", 
		 "包头市商业银行。雄鹰卡", 
		 "连云港市商业银行。金猴神通借记卡", 
		 "连云港市商业银行。金猴神通借记卡", 
		 "焦作市商业银行。月季借记卡", 
		 "焦作市商业银行。月季借记卡", 
		 "鄞州农村合作银行。蜜蜂借记卡", 
		 "鄞州农村合作银行。蜜蜂借记卡", 
		 "徽商银行淮北分行。黄山卡", 
		 "徽商银行淮北分行。黄山卡", 
		 "江阴农村商业银行。合作借记卡", 
		 "江阴农村商业银行。合作借记卡", 
		 "攀枝花市商业银行。攀枝花卡", 
		 "攀枝花市商业银行。攀枝花卡", 
		 "佛山市三水区农村信用合作社。信通卡", 
		 "佛山市三水区农村信用合作社。信通卡", 
		 "成都农信社。天府借记卡", 
		 "成都农信社。天府借记卡", 
		 "中国银行。人民币信用卡金卡", 
		 "中国银行。人民币信用卡金卡", 
		 "中国银行。人民币信用卡普通卡", 
		 "中国银行。人民币信用卡普通卡", 
		 "中国银行。中银卡", 
		 "中国银行。中银卡", 
		 "南洋商业银行。人民币信用卡金卡", 
		 "南洋商业银行。人民币信用卡金卡", 
		 "南洋商业银行。人民币信用卡普通卡", 
		 "南洋商业银行。人民币信用卡普通卡", 
		 "南洋商业银行。中银卡", 
		 "南洋商业银行。中银卡", 
		 "集友银行。人民币信用卡金卡", 
		 "集友银行。人民币信用卡金卡", 
		 "集友银行。人民币信用卡普通卡", 
		 "集友银行。人民币信用卡普通卡", 
		 "集友银行。中银卡", 
		 "集友银行。中银卡", 
		 "沧州农信社。信通卡", 
		 "沧州农信社。信通卡", 
		 "临沂市商业银行。沂蒙卡", 
		 "临沂市商业银行。沂蒙卡", 
		 "香港上海汇丰银行有限公司。人民币卡", 
		 "香港上海汇丰银行有限公司。人民币卡", 
		 "香港上海汇丰银行有限公司。人民币金卡", 
		 "香港上海汇丰银行有限公司。人民币金卡", 
		 "中山市农村信用合作社。信通卡", 
		 "中山市农村信用合作社。信通卡", 
		 "珠海市商业银行。万事顺卡", 
		 "珠海市商业银行。万事顺卡", 
		 "东亚银行有限公司。电子网络人民币卡", 
		 "东亚银行有限公司。电子网络人民币卡", 
		 "徽商银行安庆分行。黄山卡", 
		 "徽商银行安庆分行。黄山卡", 
		 "绵阳市商业银行。科技城卡", 
		 "绵阳市商业银行。科技城卡", 
		 "长沙市商业银行。芙蓉卡", 
		 "长沙市商业银行。芙蓉卡", 
		 "昆明市农村信用联社。金碧一卡通", 
		 "昆明市农村信用联社。金碧一卡通", 
		 "泉州市商业银行。海峡银联卡", 
		 "泉州市商业银行。海峡银联卡", 
		 "花旗银行有限公司。花旗人民币信用卡", 
		 "花旗银行有限公司。花旗人民币信用卡", 
		 "大新银行有限公司。大新人民币信用卡普通卡", 
		 "大新银行有限公司。大新人民币信用卡普通卡", 
		 "大新银行有限公司。人民币借记卡", 
		 "大新银行有限公司。人民币借记卡", 
		 "恒生银行有限公司。恒生人民币信用卡", 
		 "恒生银行有限公司。恒生人民币信用卡", 
		 "恒生银行有限公司。恒生人民币金卡", 
		 "恒生银行有限公司。恒生人民币金卡", 
		 "恒生银行有限公司。恒生人民币白金卡", 
		 "恒生银行有限公司。恒生人民币白金卡", 
		 "济南市商业银行。齐鲁卡", 
		 "济南市商业银行。齐鲁卡", 
		 "美国银行。人民币卡", 
		 "美国银行。人民币卡", 
		 "大连市商业银行。大连市商业银行贷记卡", 
		 "大连市商业银行。大连市商业银行贷记卡", 
		 "恒丰银行。九州借记卡", 
		 "恒丰银行。九州借记卡", 
		 "大连市商业银行。大连市商业银行贷记卡", 
		 "大连市商业银行。大连市商业银行贷记卡", 
		 "上海商业银行。人民币信用卡", 
		 "上海商业银行。人民币信用卡", 
		 "永隆银行有限公司。永隆人民币信用卡", 
		 "永隆银行有限公司。永隆人民币信用卡", 
		 "福州市商业银行。榕城卡", 
		 "福州市商业银行。榕城卡", 
		 "宁波鄞州农村合作银行。蜜蜂贷记卡", 
		 "宁波鄞州农村合作银行。蜜蜂贷记卡", 
		 "潍坊商业银行。鸢都卡", 
		 "潍坊商业银行。鸢都卡", 
		 "泸州市商业银行。酒城卡", 
		 "泸州市商业银行。酒城卡", 
		 "厦门市商业银行。银鹭借记卡", 
		 "厦门市商业银行。银鹭借记卡", 
		 "镇江市商业银行。金山灵通卡", 
		 "镇江市商业银行。金山灵通卡", 
		 "大同市商业银行。云冈卡", 
		 "大同市商业银行。云冈卡", 
		 "宜昌市商业银行。三峡卡", 
		 "宜昌市商业银行。三峡卡", 
		 "宜昌市商业银行。信用卡", 
		 "宜昌市商业银行。信用卡", 
		 "葫芦岛市商业银行。一通卡", 
		 "辽阳市商业银行。新兴卡", 
		 "辽阳市商业银行。新兴卡", 
		 "营口市商业银行。辽河一卡通", 
		 "营口市商业银行。辽河一卡通", 
		 "香港上海汇丰银行有限公司.ATM Card", 
		 "香港上海汇丰银行有限公司.ATM Card", 
		 "香港上海汇丰银行有限公司.ATM Card", 
		 "香港上海汇丰银行有限公司.ATM Card", 
		 "威海市商业银行。通达卡", 
		 "威海市商业银行。通达卡", 
		 "湖北农信社。信通卡", 
		 "湖北农信社。信通卡", 
		 "鞍山市商业银行。千山卡", 
		 "鞍山市商业银行。千山卡", 
		 "丹东商行。银杏卡", 
		 "丹东商行。银杏卡", 
		 "南通市商业银行。金桥卡", 
		 "南通市商业银行。金桥卡", 
		 "洛阳市商业银行。都市一卡通", 
		 "洛阳市商业银行。都市一卡通", 
		 "郑州商业银行。世纪一卡通", 
		 "郑州商业银行。世纪一卡通", 
		 "扬州市商业银行。绿扬卡", 
		 "扬州市商业银行。绿扬卡", 
		 "永隆银行有限公司。永隆人民币信用卡", 
		 "永隆银行有限公司。永隆人民币信用卡", 
		 "哈尔滨市商业银行。丁香借记卡", 
		 "哈尔滨市商业银行。丁香借记卡", 
		 "天津市商业银行。津卡贷记卡", 
		 "天津市商业银行。津卡贷记卡", 
		 "台州市商业银行。大唐卡", 
		 "台州市商业银行。大唐卡", 
		 "银川市商业银行。如意卡", 
		 "银川市商业银行。如意卡", 
		 "银川市商业银行。如意借记卡", 
		 "银川市商业银行。如意借记卡", 
		 "大西洋银行股份有限公司。澳门币卡", 
		 "大西洋银行股份有限公司。澳门币卡", 
		 "澳门国际银行。人民币卡", 
		 "澳门国际银行。人民币卡", 
		 "澳门国际银行。港币卡", 
		 "澳门国际银行。港币卡", 
		 "澳门国际银行。澳门币卡", 
		 "澳门国际银行。澳门币卡", 
		 "广州农村信用合作社联合社。麒麟储蓄卡", 
		 "广州农村信用合作社。麒麟储蓄卡", 
		 "吉林市商业银行。雾凇卡", 
		 "吉林市商业银行。雾凇卡", 
		 "三门峡市城市信用社。天鹅卡", 
		 "三门峡市城市信用社。天鹅卡", 
		 "抚顺市商业银行。绿叶卡", 
		 "抚顺市商业银行。绿叶卡", 
		 "昆山农村信用合作社联合社。江通卡", 
		 "昆山农村信用合作社联合社。江通卡", 
		 "常州商业银行。月季卡", 
		 "常州商业银行。月季卡", 
		 "湛江市商业银行。南珠卡", 
		 "湛江市商业银行。南珠卡", 
		 "金华市商业银行。双龙借记卡", 
		 "金华市商业银行。双龙借记卡", 
		 "金华市商业银行。双龙贷记卡", 
		 "金华市商业银行。双龙贷记卡", 
		 "大新银行有限公司。大新人民币信用卡金卡", 
		 "大新银行有限公司。大新人民币信用卡金卡", 
		 "江苏农信社。圆鼎卡", 
		 "江苏农信社。圆鼎卡", 
		 "中信嘉华银行有限公司。人民币信用卡金卡", 
		 "中信嘉华银行有限公司。人民币信用卡金卡", 
		 "中信嘉华银行有限公司。人民币信用卡普通卡", 
		 "中信嘉华银行有限公司。人民币信用卡普通卡", 
		 "中信嘉华银行有限公司。人民币借记卡", 
		 "中信嘉华银行有限公司。人民币借记卡", 
		 "常熟市农村商业银行。粒金贷记卡", 
		 "常熟市农村商业银行。粒金贷记卡", 
		 "廖创兴银行有限公司。港币借记卡", 
		 "廖创兴银行有限公司。港币借记卡", 
		 "沈阳市商业银行。玫瑰卡", 
		 "沈阳市商业银行。玫瑰卡", 
		 "广州市商业银行。羊城借记卡", 
		 "广州市商业银行。羊城借记卡", 
		 "上海银行。申卡", 
		 "上海银行。申卡", 
		 "江门市新会农信社。信通卡", 
		 "江门市新会农信社。信通卡", 
		 "东亚银行有限公司。人民币信用卡", 
		 "东亚银行有限公司。人民币信用卡", 
		 "东亚银行有限公司。人民币信用卡金卡", 
		 "东亚银行有限公司。人民币信用卡金卡", 
		 "乌鲁木齐市商业银行。雪莲贷记卡", 
		 "乌鲁木齐市商业银行。雪莲贷记卡", 
		 "高要市农村信用联社。信通卡", 
		 "高要市农村信用联社。信通卡", 
		 "上海市农村信用合作社联合社。如意卡", 
		 "上海市农村信用合作社联社。如意卡", 
		 "江阴市农村商业银行。合作贷记卡", 
		 "江阴市农村商业银行。合作贷记卡", 
		 "无锡市商业银行。太湖金保卡", 
		 "无锡市商业银行。太湖金保卡", 
		 "绍兴市商业银行。兰花卡", 
		 "绍兴市商业银行。兰花卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "吴江农村商业银行。垂虹卡", 
		 "吴江农村商业银行。垂虹卡", 
		 "大新银行有限公司。借记卡", 
		 "大新银行有限公司。借记卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联人民币银行卡", 
		 "星展银行。银联银行卡", 
		 "星展银行。银联港币银行卡", 
		 "星展银行。银联港币银行卡", 
		 "星展银行。银联银行卡", 
		 "星展银行。银联银行卡", 
		 "星展银行。银联港币银行卡", 
		 "星展银行。银联港币银行卡", 
		 "星展银行。银联银行卡", 
		 "AEON 信贷财务.AEON JUSCO 银联卡", 
		 "AEON 信贷财务.AEON JUSCO 银联卡", 
		 "Travelex.Travelex 港币卡", 
		 "Travelex.Travelex 港币卡", 
		 "Travelex.Travelex 美元卡", 
		 "Travelex.Travelex 美元卡", 
		 "石家庄市商业银行。如意借记卡", 
		 "石家庄市商业银行。如意借记卡", 
		 "石家庄市商业银行。如意借记卡", 
		 "石家庄市商业银行。如意借记卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "陕西省农村信用社联合社。陕西信合富泰卡", 
		 "陕西省农村信用社联合社。陕西信合富泰卡", 
		 "高要市农村信用合作社联合社。信通白金卡", 
		 "高要市农村信用合作社联社。信通白金卡", 
		 "高要市农村信用合作社联合社。信通金卡", 
		 "高要市农村信用合作社联社。信通金卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡白金卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡白金卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡普卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡普卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡钻石卡", 
		 "上海浦东发展银行。东方 - 轻松理财卡钻石卡", 
		 "上海浦东发展银行。东方 - 新标准准贷记卡", 
		 "上海浦东发展银行。东方 - 新标准准贷记卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "上海浦东发展银行。东方卡", 
		 "深圳发展银行。人民币信用卡金卡", 
		 "深圳发展银行。人民币信用卡金卡", 
		 "深圳发展银行。人民币信用卡普卡", 
		 "深圳发展银行。人民币信用卡普卡", 
		 "深圳发展银行。发展卡", 
		 "深圳发展银行。发展卡", 
		 "大丰银行有限公司。人民币借记卡", 
		 "大丰银行有限公司。人民币借记卡", 
		 "大丰银行有限公司。港币借记卡", 
		 "大丰银行有限公司。港币借记卡", 
		 "大丰银行有限公司。澳门币借记卡", 
		 "大丰银行有限公司。澳门币借记卡", 
		 "哈萨克斯坦国民储蓄银行.Halykbank Classic", 
		 "哈萨克斯坦国民储蓄银行.Halykbank Classic", 
		 "哈萨克斯坦国民储蓄银行.Halykbank Golden", 
		 "哈萨克斯坦国民储蓄银行.Halykbank Golden", 
		 "德阳市商业银行。锦程卡定活一卡通白金卡", 
		 "德阳市商业银行。锦程卡定活一卡通白金卡", 
		 "德阳市商业银行。锦程卡定活一卡通金卡", 
		 "德阳市商业银行。锦程卡定活一卡通金卡", 
		 "德阳市商业银行。锦程卡定活一卡通", 
		 "德阳市商业银行。锦程卡定活一卡通", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。一卡通", 
		 "招商银行银行。一卡通", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。招商银行信用卡", 
		 "招商银行银行。招商银行银行信用卡", 
		 "招商银行。一卡通", 
		 "招商银行银行。一卡通", 
		 "招商银行。公司卡", 
		 "招商银行银行。公司卡", 
		 "民生银行。民生信用卡", 
		 "民生银行。民生信用卡", 
		 "民生银行。民生信用卡", 
		 "民生银行。民生信用卡", 
		 "中国民生银行。民生银联白金信用卡", 
		 "中国民生银行。民生银联白金信用卡", 
		 "中国民生银行。民生银联商务信用卡", 
		 "中国民生银行。民生银联商务信用卡", 
		 "民生银行。民生借记卡", 
		 "民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "中国民生银行。民生借记卡", 
		 "华夏银行。华夏卡", 
		 "华夏银行。华夏卡", 
		 "华夏银行。华夏至尊金卡", 
		 "华夏银行。华夏至尊金卡", 
		 "华夏银行。华夏丽人卡", 
		 "华夏银行。华夏丽人卡", 
		 "华夏银行。华夏万通卡", 
		 "华夏银行。华夏万通卡", 
		 "中国光大银行。炎黄卡普卡", 
		 "中国光大银行。炎黄卡普卡", 
		 "中国光大银行。炎黄卡白金卡", 
		 "中国光大银行。炎黄卡白金卡", 
		 "中国光大银行。炎黄卡金卡", 
		 "中国光大银行。炎黄卡金卡", 
		 "光大银行。阳光卡", 
		 "光大银行。阳光卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "江西省农村信用社联合社。百福卡", 
		 "江西省农村信用社联合社。百福卡", 
		 "江西省农村信用社联合社。百福卡", 
		 "江西省农村信用社联合社。百福卡", 
		 "渤海银行。渤海银行公司借记卡", 
		 "渤海银行。渤海银行公司借记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行信用卡中心。中信银联标准贷记卡", 
		 "中信实业银行。中信借记卡", 
		 "中信实业银行。中信借记卡", 
		 "中信实业银行。中信借记卡", 
		 "中信实业银行。中信借记卡", 
		 "中信实业银行。中信贵宾卡", 
		 "中信实业银行。中信贵宾卡", 
		 "中信银行。中信理财宝金卡", 
		 "中信银行。中信理财宝金卡", 
		 "中信银行。中信理财宝白金卡", 
		 "中信银行。中信理财宝白金卡", 
		 "建设银行。龙卡储蓄卡", 
		 "中国建设银行。龙卡储蓄卡", 
		 "中国建设银行。龙卡准贷记卡", 
		 "中国建设银行。龙卡准贷记卡", 
		 "中国建设银行。龙卡准贷记卡金卡", 
		 "中国建设银行。龙卡准贷记卡金卡", 
		 "中国银行澳门分行。人民币信用卡", 
		 "中国银行澳门分行。人民币信用卡", 
		 "中国银行澳门分行。人民币信用卡", 
		 "中国银行澳门分行。人民币信用卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 个人普卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 个人金卡", 
		 "中国银行。长城人民币信用卡 - 专用卡普卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 员工金卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 员工金卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 员工金卡", 
		 "中国银行。长城人民币信用卡", 
		 "中国银行。长城人民币信用卡 - 单位普卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城人民币信用卡 - 单位金卡", 
		 "中国银行。银联单币贷记卡", 
		 "中国银行。银联单币贷记卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国银行。长城信用卡", 
		 "中国银行澳门分行。中银卡", 
		 "中国银行澳门分行。中银卡", 
		 "曲靖市商业银行。珠江源卡", 
		 "曲靖市商业银行。珠江源卡", 
		 "农业银行。金穗校园卡", 
		 "农业银行。金穗校园卡", 
		 "农业银行。金穗星座卡", 
		 "农业银行。金穗星座卡", 
		 "农业银行。金穗社保卡", 
		 "农业银行。金穗社保卡", 
		 "农业银行。金穗旅游卡", 
		 "农业银行。金穗旅游卡", 
		 "农业银行。金穗青年卡", 
		 "农业银行。金穗青年卡", 
		 "农业银行。复合介质金穗通宝卡", 
		 "农业银行。复合介质金穗通宝卡", 
		 "农业银行。金穗海通卡", 
		 "农业银行。金穗贷记卡", 
		 "农业银行。金穗贷记卡", 
		 "农业银行。金穗贷记卡", 
		 "农业银行。金穗贷记卡", 
		 "农业银行。金穗通宝卡（暂未使用）", 
		 "农业银行。金穗通宝卡", 
		 "农业银行。金穗惠农卡", 
		 "农业银行。金穗通宝卡（暂未使用）", 
		 "农业银行。金穗通宝贵宾卡 (银)", 
		 "农业银行。金穗通宝卡（暂未使用）", 
		 "农业银行。金穗通宝卡", 
		 "农业银行。金穗通宝贵宾卡（金）", 
		 "农业银行。金穗通宝卡", 
		 "农业银行。金穗通宝贵宾卡（白金）", 
		 "中国农业银行。金穗通宝卡", 
		 "农业银行。金穗通宝卡（单位卡）", 
		 "农业银行。金穗通宝卡", 
		 "农业银行。金穗通宝卡（个人普卡）", 
		 "农业银行。金穗通宝卡", 
		 "农业银行。金穗通宝贵宾卡（钻石）", 
		 "江苏东吴农村商业银行。新苏卡", 
		 "江苏东吴农村商业银行。新苏卡", 
		 "桂林市商业银行。漓江卡", 
		 "桂林市商业银行。漓江卡", 
		 "日照市商业银行。黄海卡", 
		 "日照市商业银行。黄海卡", 
		 "浙江省农村信用社联合社。丰收卡", 
		 "浙江省农村信用社联社。丰收卡", 
		 "珠海农村信用合作社联社。信通卡", 
		 "珠海农村信用合作联社。信通卡", 
		 "大庆市商业银行。玉兔卡", 
		 "大庆市商业银行。玉兔卡", 
		 "澳门永亨银行股份有限公司。人民币卡", 
		 "澳门永亨银行股份有限公司。人民币卡", 
		 "莱芜市商业银行。金凤卡", 
		 "莱芜市商业银行。金凤卡", 
		 "长春市商业银行。君子兰一卡通", 
		 "长春市商业银行。君子兰一卡通", 
		 "徐州市商业银行。彭城借记卡", 
		 "徐州市商业银行。彭城借记卡", 
		 "重庆市农村信用社联合社。信合平安卡", 
		 "重庆市农村信用社联合社。信合平安卡", 
		 "太仓农村商业银行。郑和卡", 
		 "太仓农村商业银行。郑和卡", 
		 "靖江市长江城市信用社。长江卡", 
		 "靖江市长江城市信用社。长江卡", 
		 "永亨银行。永亨尊贵理财卡", 
		 "永亨银行。永亨尊贵理财卡", 
		 "徽商银行。黄山卡", 
		 "徽商银行。黄山卡", 
		 "杭州市商业银行。西湖卡", 
		 "杭州市商业银行。西湖卡", 
		 "徽商银行。黄山卡", 
		 "徽商银行。黄山卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "柳州市商业银行。龙城卡", 
		 "尧都区农村信用合作社联社。天河卡", 
		 "尧都区农村信用合作社联社。天河卡", 
		 "渤海银行。渤海银行借记卡", 
		 "渤海银行。渤海银行借记卡", 
		 "重庆市农村信用社联合社。信合希望卡", 
		 "重庆市农村信用社联合社。信合希望卡", 
		 "烟台市商业银行。金通卡", 
		 "烟台市商业银行。金通卡", 
		 "武进农村商业银行。阳湖卡", 
		 "武进农村商业银行。阳湖卡", 
		 "上海银行。申卡借记卡", 
		 "上海银行。申卡借记卡", 
		 "贵州省农村信用社联合社。信合卡", 
		 "贵州省农村信用社联合社。信合卡", 
		 "江苏锡州农村商业银行。金阿福", 
		 "江苏锡州农村商业银行。金阿福", 
		 "中外合资。南充市商业银行.熊猫团团卡", 
		 "中外合资。南充市商业银行.熊猫团团卡", 
		 "长沙市商业银行。芙蓉贷记卡", 
		 "长沙市商业银行。芙蓉贷记卡", 
		 "长沙市商业银行。芙蓉贷记卡", 
		 "长沙市商业银行。芙蓉贷记卡", 
		 "兴业银行。银联信用卡", 
		 "兴业银行。银联信用卡", 
		 "兴业银行。兴业自然人生理财卡", 
		 "兴业银行。兴业自然人生理财卡", 
		 "兴业银行。万能卡", 
		 "兴业银行。万能卡", 
		 "石嘴山城市信用社。麒麟卡", 
		 "张家口市商业银行。好运卡", 
		 "交通银行。太平洋卡", 
		 "中国工商银行。公务卡", 
		 "中国建设银行。公务卡", 
		 "大庆市商业银行。公务卡", 
		 "Discover Financial Services，Inc.发现卡", 
		 ".发现卡", 
		 "Discover Financial Services，Inc.发现卡", 
		 ".发现卡", 
		 "Discover Financial Services，Inc.发现卡", 
		 ".发现卡", 
		 "Discover Financial Services，Inc.发现卡", 
		 ".发现卡", 
		 "上海银行。上海明珠卡", 
		 "上海银行。上海明珠卡", 
		 "泉州市商业银行。海峡储蓄卡", 
		 "泉州市商业银行。海峡储蓄卡", 
		 "广东发展银行。广发信用卡", 
		 "广东发展银行。广发 VISA 信用卡", 
		 "广东发展银行。广发理财通", 
		 "广东发展银行。广发 VISA 信用卡", 
		 "广东发展银行。广发理财通", 
		 "广东发展银行。广发信用卡", 
		 "招商。招行一卡通", 
		 "招商。招行一卡通", 
		 "招商银行。招商银行银行一卡通", 
		 "招商银行。招商银行银行一卡通", 
		 "长沙市商业银行。芙蓉卡", 
		 "长沙市商业银行。芙蓉卡", 
		 "南通商业银行。金桥卡", 
		 "南通商业银行。金桥卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "浦东发展银行。东方卡", 
		 "贵阳市商业银行。甲秀卡", 
		 "贵阳市商业银行。甲秀卡", 
		 "郑州市商业银行。世纪一卡通", 
		 "工商银行。牡丹银联灵通卡 - 个人普卡", 
		 "工商银行。牡丹银联灵通卡 - 个人普卡", 
		 "工商银行。牡丹银联灵通卡 - 个人金卡", 
		 "工商银行。牡丹银联理财金卡", 
		 "上海浦东发展银行。东方卡", 
		 "深圳发展银行。发展卡", 
};
	public static String getNameOfBank(char[] charBin, int offset)
	{
		long longBin = 0;
		for(int i=0; i< 6; i++)
		{
			longBin = (longBin*10) + (charBin[i+offset]-48);		
		}
		Log.e("sangfei.code", "bankBin: "+longBin);
		int index = binarySearch(bankBin, longBin);
		if(index==-1)
		{
			return "磁条卡卡号:n";
		}
		return bankName[index]+":n";
	}
	//二分查找方法
	public static int binarySearch(long[] srcArray, long des){
		int low = 0;
		int high = srcArray.length-1;
		while(low <= high) 
		{
			int middle = (low + high)/2;
			if(des == srcArray[middle]) 
			{ 
				return middle;
			}
			else if(des <srcArray[middle]) 
			{ 
				high = middle - 1; 
			}
			else 
			{ 
				low = middle + 1;
			}
		} 
		return -1;
	}
}
```
使用例子:
```java
char[] cardNumber = {‘6’, ‘2’, ‘2’, ‘8’, ‘2’, ‘5’, ‘0’};//卡号
Sring name = BankInfo.getNameOfBank(cardNumber, 0);//获取银行卡的信息
```