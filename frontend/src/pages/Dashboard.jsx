import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Dashboard({ user }) {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [inputText, setInputText] = useState('')
  const [copying, setCopying] = useState(null)
  const [copySuccess, setCopySuccess] = useState(null)
  const [generatedCopies, setGeneratedCopies] = useState([])
  const [dailyCount, setDailyCount] = useState(user?.dailyCount || 0)
  const navigate = useNavigate()

  useEffect(() => {
    // 每次用户信息更新时，同步每日计数
    if (user) {
      setDailyCount(user.dailyCount || 0)
    }
  }, [user])

  const handleLogout = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/logout`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        navigate('/login')
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateCopies = async () => {
    if (!inputText.trim()) {
      alert('请输入菜名和特点')
      return
    }

    setGenerating(true)
    
    try {
      // 调用后端API生成文案
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/copy/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ text: inputText })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setGeneratedCopies(data.copies)
        setDailyCount(data.dailyCount || 0)
      } else if (data.isLimitReached) {
        // 次数达到上限，跳转到升级页面
        navigate('/upgrade')
      } else {
        // 使用模拟数据作为备用
        setGeneratedCopies([
          {
            text: `【${inputText.split('，')[0]}】\n\n今天给大家推荐一道超好吃的${inputText.split('，')[0]}😋\n${inputText.split('，')[1] || ''}\n\n咬上一口，满满的幸福感～\n\n快来我家小店尝尝吧！`,
            tags: ['#美食分享', '#小店推荐', '#美食探店']
          },
          {
            text: `OMG！这家店的${inputText.split('，')[0]}太绝了！\n\n${inputText.split('，')[1] || ''}\n\n完全停不下来的节奏，强烈推荐给大家～\n\n地址：[你的店铺地址]`,
            tags: ['#美食推荐', '#探店打卡', '#吃货日常']
          },
          {
            text: `今日份快乐是${inputText.split('，')[0]}给的！\n\n${inputText.split('，')[1] || ''}\n\n这味道，简直了！\n\n朋友们一定要来试试！`,
            tags: ['#美食打卡', '#必吃榜', '#美食日常']
          }
        ])
      }
    } catch (err) {
      console.error('生成文案失败:', err)
      // 使用模拟数据作为备用
      setGeneratedCopies([
        {
          text: `【${inputText.split('，')[0]}】\n\n今天给大家推荐一道超好吃的${inputText.split('，')[0]}😋\n${inputText.split('，')[1] || ''}\n\n咬上一口，满满的幸福感～\n\n快来我家小店尝尝吧！`,
          tags: ['#美食分享', '#小店推荐', '#美食探店']
        },
        {
          text: `OMG！这家店的${inputText.split('，')[0]}太绝了！\n\n${inputText.split('，')[1] || ''}\n\n完全停不下来的节奏，强烈推荐给大家～\n\n地址：[你的店铺地址]`,
          tags: ['#美食推荐', '#探店打卡', '#吃货日常']
        },
        {
          text: `今日份快乐是${inputText.split('，')[0]}给的！\n\n${inputText.split('，')[1] || ''}\n\n这味道，简直了！\n\n朋友们一定要来试试！`,
          tags: ['#美食打卡', '#必吃榜', '#美食日常']
        }
      ])
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = (text, index) => {
    setCopying(index)
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(index)
        setTimeout(() => {
          setCopySuccess(null)
        }, 2000)
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
      .finally(() => {
        setCopying(null)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">小店爆文助手</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* 订阅状态 */}
              {user?.isPremium ? (
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                  高级会员
                </span>
              ) : (
                <Link
                  to="/upgrade"
                  className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium hover:bg-blue-200 transition-colors"
                >
                  免费用户
                </Link>
              )}
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '退出中...' : '退出登录'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 核心功能区 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            朋友圈文案生成
          </h2>
          
          {/* 每日次数限制 */}
          {!user?.isPremium && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 text-sm">
                  今日剩余生成次数：{3 - dailyCount}/3
                </span>
                <Link
                  to="/upgrade"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  升级解锁无限次数
                </Link>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* 输入区域 */}
            <div>
              <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
                输入菜名和特点（例如：红烧肉，肥而不腻）
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="请输入菜名和特点..."
              />
            </div>

            {/* 生成按钮 */}
            <div>
              <button
                onClick={generateCopies}
                disabled={generating || !inputText.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    生成中...
                  </div>
                ) : (
                  '生成文案'
                )}
              </button>
            </div>

            {/* 生成结果 */}
            {generatedCopies.length > 0 && (
              <div className="space-y-6 mt-8">
                <h3 className="text-lg font-medium text-gray-900">生成的朋友圈文案：</h3>
                
                {generatedCopies.map((copy, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="prose max-w-none mb-4 whitespace-pre-wrap">
                      {copy.text}
                    </div>
                    
                    {/* 小红书话题标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {copy.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="text-xs px-2 py-1 bg-pink-100 text-pink-700 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* 复制按钮 */}
                    <button
                      onClick={() => copyToClipboard(copy.text, index)}
                      disabled={copying === index}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                    >
                      {copySuccess === index ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          已复制
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          一键复制
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">内容管理</h3>
            <p className="text-blue-600">创建和管理您的爆文内容</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h3 className="text-lg font-medium text-green-800 mb-2">数据分析</h3>
            <p className="text-green-600">查看您的内容表现数据</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-lg font-medium text-purple-800 mb-2">账号设置</h3>
            <p className="text-purple-600">管理您的个人信息和偏好设置</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard