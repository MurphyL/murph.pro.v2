import React from 'react';

import { Box, Chip, List, ListItem, ListItemText, ListSubheader, Paper, Stack, Typography } from '@mui/material';

import { useDocumentTitle } from '/src/plug/hooks';

import CodeBlock from "/src/plug/widgets/code/code-block.v1";

const MESSAGE_PARTS = ['<method>', '<status-code>', '<headers>'];

/**
 * - https://www.runoob.com/http/http-methods.html
 * - https://www.runoob.com/http/http-header-fields.html
 * @returns 
 */
export default function HTTPResponseLineList() {
	useDocumentTitle('HTTP 响应');
	const [selected, setPart] = React.useState('<status-code>');
	return (
		<Box direction="row" sx={{ display: 'flex', height: '100%', }}>
			<Stack spacing={1} sx={{ flex: 1, py: '10px', px: 2, height: 'calc(100% - 10px * 2)', overflowY: 'auto' }}>
				<Stack direction="row" spacing={2} sx={{ px: 2, py: 1 }}>
					{MESSAGE_PARTS.map(part => (
						<Chip key={part} size="small" label={part} color={part === selected ? 'primary' : 'default'} onClick={() => setPart(part)} />
					))}
				</Stack>
				{Object.entries(HTTP_STATUS).map(([group, data]) => (
					<Paper key={group} variant="outlined">
						<List subheader={<GroupHeader label={`HTTP 状态码 - ${data.label}（${group}）`} desc={data.desc} />}>
							{data.codes.map((code, index) => (
								<ListItem key={index} >
									<ListItemText primary={code.phrase} secondary={code.desc} />
								</ListItem>
							))}
						</List>
					</Paper>
				))}
			</Stack>
			<Stack sx={{ px: 1, width: '700px', overflowY: 'auto' }}>
				<List subheader={<GroupHeader label="请求报文" desc="请求地址、参数" />}>
					<CodeBlock dark={false} language="shell" children={[
						'<method> <request-URL> <version>			# Head line',
						'<headers>									# 请求头\n',
						'<entity-body>								# 响应体'
					].join('\n')} />
				</List>
				<List subheader={<GroupHeader label="响应报文" desc="响应数据" />}>
					<CodeBlock dark={false} language="shell" children={[
						'<version> <status-code> <reason-phrase>	# Head line',
						'<headers>									# 请求头\n',
						'<entity-body>								# 响应体'
					].join('\n')} />
				</List>
				<List subheader={<GroupHeader label="报文描述" desc="报文参数描述" />}>
					<CodeBlock dark={false} language="shell" children={[
						'<method> - 客户端希望服务器对请求资源执行的动作；',
						'<request-URL> - 指定锁所请求的资源；',
						'<version> - HTTP 版本 - HTTP/<major>.<minor>；',
						'<status-code> - 用三位数字描述服务端执行动作的情况；',
						'<reason-phrase> - 服务端执行情况的描述短语；',
						'<headers> - 零个或多个请求头，最后一个是 CRLF；',
						'<entity-body> - 任意数据组成的数据块。',
					].join('\n')} />
				</List>
			</Stack>
		</Box>
	);
}

function GroupHeader({ label, desc }) {
	return (
		<ListSubheader disableSticky={true} component="div" sx={{ pt: 1, borderBottom: '1px solid var(--border-color)' }}>
			<Typography variant="h6" component="h6">{label}</Typography>
			<Typography variant="p">{desc}</Typography>
		</ListSubheader>
	);
}

const HTTP_STATUS = {
	"1xx": {
		"label": "请求信息",
		"desc": "临时性响应。此响应仅由状态行和可选的HTTP头组成，以一个空行结尾。",
		"codes": [
			{
				"phrase": "100 Continue",
				"desc": "请继续请求"
			},
			{
				"phrase": "101 Switching Protocols",
				"desc": "请切换协议"
			},
			{
				"phrase": "102 Processing",
				"desc": "将继续执行请求"
			}
		]
	},
	"2xx": {
		"label": "成功状态",
		"desc": "客户端的请求已经被服务器端成功接收并正确解析。",
		"codes": [
			{
				"phrase": "200 OK",
				"desc": "请求成功"
			},
			{
				"phrase": "201 Created",
				"desc": "请求已被接受，等待资源响应"
			},
			{
				"phrase": "202 Accepted",
				"desc": "请求已被接受，但尚未处理"
			},
			{
				"phrase": "203 Non-Authoritative Information",
				"desc": "请求已成功处理，结果来自第三方拷贝"
			},
			{
				"phrase": "204 No Content",
				"desc": "请求已成功处理，但无返回内容"
			},
			{
				"phrase": "205 Reset Content",
				"desc": "请求已成功处理，但需重置内容"
			},
			{
				"phrase": "206 Partial Content",
				"desc": "请求已成功处理，但仅返回了部分内容"
			},
			{
				"phrase": "207 Multi-Status",
				"desc": "请求已成功处理，返回了多个状态的XML消息"
			},
			{
				"phrase": "208 Already Reported",
				"desc": "响应已发送"
			},
			{
				"phrase": "226 IM Used",
				"desc": "已完成响应"
			}
		]
	},
	"3xx": {
		"label": "重定向",
		"desc": "客户端需要采取更进一步的行动来完成请求。通常，这些状态码用来重定向，后续的请求地址（重定向目标）在本次响应的Location域中指明。",
		"codes": [
			{
				"phrase": "300 Multiple Choices",
				"desc": "返回多条重定向供选择"
			},
			{
				"phrase": "301 Moved Permanently",
				"desc": "永久重定向"
			},
			{
				"phrase": "302 Found",
				"desc": "临时重定向"
			},
			{
				"phrase": "303 See Other",
				"desc": "当前请求的资源在其它地址"
			},
			{
				"phrase": "304 Not Modified",
				"desc": "请求资源与本地缓存相同，未修改"
			},
			{
				"phrase": "305 Use Proxy",
				"desc": "必须通过代理访问"
			},
			{
				"phrase": "306 (已废弃)Switch Proxy",
				"desc": "(已废弃)请切换代理"
			},
			{
				"phrase": "307 Temporary Redirect",
				"desc": "临时重定向，同302"
			},
			{
				"phrase": "308 Permanent Redirect",
				"desc": "永久重定向，且禁止改变http方法"
			}
		]
	},
	"4xx": {
		"label": "客户端错误",
		"desc": "客户端的请求存在错误，导致服务器无法处理。",
		"codes": [
			{
				"phrase": "400 Bad Request",
				"desc": "请求错误，通常是访问的域名未绑定引起"
			},
			{
				"phrase": "401 Unauthorized",
				"desc": "需要身份认证验证"
			},
			{
				"phrase": "402 Payment Required",
				"desc": "-"
			},
			{
				"phrase": "403 Forbidden",
				"desc": "禁止访问"
			},
			{
				"phrase": "404 Not Found",
				"desc": "请求的内容未找到或已删除"
			},
			{
				"phrase": "405 Method Not Allowed",
				"desc": "不允许的请求方法"
			},
			{
				"phrase": "406 Not Acceptable",
				"desc": "无法响应，因资源无法满足客户端条件"
			},
			{
				"phrase": "407 Proxy Authentication Required",
				"desc": "要求通过代理的身份认证"
			},
			{
				"phrase": "408 Request Timeout",
				"desc": "请求超时"
			},
			{
				"phrase": "409 Conflict",
				"desc": "存在冲突"
			},
			{
				"phrase": "410 Gone",
				"desc": "资源已经不存在(过去存在)"
			},
			{
				"phrase": "411 Length Required",
				"desc": "无法处理该请求"
			},
			{
				"phrase": "412 Precondition Failed",
				"desc": "请求条件错误"
			},
			{
				"phrase": "413 Payload Too Large",
				"desc": "请求的实体过大"
			},
			{
				"phrase": "414 Request-URI Too Long",
				"desc": "请求的URI过长"
			},
			{
				"phrase": "415 Unsupported Media Type",
				"desc": "无法处理的媒体格式"
			},
			{
				"phrase": "416 Range Not Satisfiable",
				"desc": "请求的范围无效"
			},
			{
				"phrase": "417 Expectation Failed",
				"desc": "无法满足的Expect"
			},
			{
				"phrase": "418 I'm a teapot",
				"desc": "愚人节笑话"
			},
			{
				"phrase": "421 There are too many connections from your internet address",
				"desc": "连接数超限"
			},
			{
				"phrase": "422 Unprocessable Entity",
				"desc": "请求的语义错误"
			},
			{
				"phrase": "423 Locked",
				"desc": "当前资源被锁定"
			},
			{
				"phrase": "424 Failed Dependency",
				"desc": "当前请求失败"
			},
			{
				"phrase": "425 Unordered Collection",
				"desc": "未知"
			},
			{
				"phrase": "426 Upgrade Required",
				"desc": "请切换到TLS/1.0"
			},
			{
				"phrase": "428 Precondition Required",
				"desc": "请求未带条件"
			},
			{
				"phrase": "429 Too Many Requests",
				"desc": "并发请求过多"
			},
			{
				"phrase": "431 Request Header Fields Too Large",
				"desc": "请求头过大"
			},
			{
				"phrase": "449 Retry With",
				"desc": "请重试"
			},
			{
				"phrase": "451 Unavailable For Legal Reasons",
				"desc": "访问被拒绝（法律的要求）"
			},
			{
				"phrase": "499 Client Closed Request",
				"desc": "客户端主动关闭了连接"
			}
		]
	},
	"5xx": {
		"label": "服务器错误",
		"desc": "服务器在处理请求的过程中有错误或者异常状态发生，也有可能是服务器意识到以当前的软硬件资源无法完成对请求的处理。",
		"codes": [
			{
				"phrase": "500 Internal Server Error",
				"desc": "服务器端程序错误"
			},
			{
				"phrase": "501 Not Implemented",
				"desc": "服务器不支持的请求方法"
			},
			{
				"phrase": "502 Bad Gateway",
				"desc": "网关无响应"
			},
			{
				"phrase": "503 Service Unavailable",
				"desc": "服务器端临时错误"
			},
			{
				"phrase": "504 Gateway Timeout",
				"desc": "网关超时"
			},
			{
				"phrase": "505 HTTP Version Not Supported",
				"desc": "服务器不支持的HTTP版本"
			},
			{
				"phrase": "506 Variant Also Negotiates",
				"desc": "服务器内部配置错误"
			},
			{
				"phrase": "507 Insufficient Storage",
				"desc": "服务器无法存储请求"
			},
			{
				"phrase": "508 Loop Detected",
				"desc": "服务器因死循环而终止操作"
			},
			{
				"phrase": "509 Bandwidth Limit Exceeded",
				"desc": "服务器带宽限制"
			},
			{
				"phrase": "510 Not Extended",
				"desc": "获取资源策略未被满足"
			},
			{
				"phrase": "511 Network Authentication Required",
				"desc": "需验证以许可连接"
			},
			{
				"phrase": "599 Network Connect Timeout Error",
				"desc": "网络连接超时"
			}
		]
	}
};