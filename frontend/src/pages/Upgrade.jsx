import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Upgrade() {
  const [upgrading, setUpgrading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const navigate = useNavigate()

  const handleUpgrade = () => {
    // 显示收款码弹窗
    setShowQRCode(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            升级到高级会员
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            解锁无限文案生成次数
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">高级会员</h3>
            <p className="text-gray-600 mb-4">解锁所有功能，无限生成文案</p>
            <div className="text-4xl font-bold text-blue-600 mb-2">¥39.9/月</div>
            <p className="text-sm text-gray-500">支持随时取消</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">无限文案生成次数</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">优先使用 AI 模型</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">无水印输出</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">专属客服支持</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upgrading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                处理中...
              </div>
            ) : (
              '立即升级'
            )}
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              返回控制台
            </Link>
          </div>
        </div>
      </div>

      {/* 收款码弹窗 */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">请扫码支付</h3>
              <div className="mb-4">
                <img 
                  src="https://i.postimg.cc/65M4j0q7/wechat-qr.jpg" 
                  alt="微信收款码" 
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-gray-600 mb-4">
                请扫码支付 <span className="font-bold text-blue-600">39.9元/月</span>
              </p>
              <p className="text-gray-600 mb-6">
                支付完成后，请截图联系客服开通
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => setShowQRCode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  已支付
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upgrade