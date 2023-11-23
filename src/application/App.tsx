import { ConfigProvider, App as AntApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import locale from 'antd/locale/vi_VN'
import Router from './routes/router'
import { useAppSelector } from '~/application/hooks/reduxHook'
import { AxiosInterceptor } from '~/utils/api/axiosClient'

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.app)

  return (
    <ConfigProvider
      theme={{
        token: theme
      }}
      locale={locale}
    >
      <StyleProvider hashPriority='high'>
        <AntApp>
          <AxiosInterceptor>
            <Router />
          </AxiosInterceptor>
        </AntApp>
      </StyleProvider>
    </ConfigProvider>
  )
}
export default App
