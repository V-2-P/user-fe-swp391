import { Button, Space, Image, Row } from 'antd'
import React from 'react'

const LandingPage: React.FC = () => {
  return (
    <div className='w-full h-full'>
      <Row style={{ height: 'calc(100vh - 64px)', width: '100%' }} className='relative '>
        <Image
          preview={false}
          src='/Landing-banner.jpg'
          height='calc(100vh - 64px)'
          width='100%'
          className='!object-cover'
        />
        <div className='absolute top-32 left-16'>
          <p
            style={{
              color: '#FFF',
              fontFamily: 'Judson',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 400,
              width: '418px'
            }}
          >
            Dịch vụ lai giống chim Buôn bán chim cảnh Với các dòng chim đẹp, độc, lạ.
          </p>
          <h1
            style={{
              color: '#FFF',
              fontFamily: 'Judson',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 400,
              marginTop: '3rem'
            }}
          >
            Chào mừng đến “Thiên đường chim cảnh”
          </h1>
        </div>
      </Row>
      <section style={{ minHeight: 'calc(100vh - 64px)', width: '100%' }} className='text-center px-20 py-10'>
        <Space direction='vertical' size='middle' className='h-full'>
          <Button className='!bg-[#213F36] py-[24px]' size='large' shape='round'>
            Trải nghiệm dịch vụ
          </Button>
          <p>Hãy sở hữu cho mình một con chim to đẹp nào</p>

          <p
            style={{
              color: ' #000',

              textAlign: 'center',
              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

              fontSize: '36px',
              fontStyle: 'normal',
              fontWeight: 700
            }}
          >
            Về Thiên Đường Chim Cảnh
          </p>
          <p
            style={{
              color: '#000',
              fontSize: '36px',
              fontStyle: 'normal',
              fontWeight: 400
            }}
          >
            Tại Thiên Đường Chim Cảnh, chúng tôi tập trung vào việc mang đến cho bạn những trải nghiệm tuyệt vời về thế
            giới chim cảnh. Với đội ngũ chuyên gia giàu kinh nghiệm và đam mê, chúng tôi cam kết cung cấp những con chim
            cảnh chất lượng và sức khỏe tốt cho các tín đồ yêu thú cưng.
          </p>
        </Space>
      </section>
      <section style={{ minHeight: 'calc(100vh - 64px)', width: '100%' }} className='!bg-[#193D3D] px-20 py-10'>
        <div id='page'>
          <div id='intro' className='clearfix container custome-margin '>
            <div id='thumbnail' style={{ right: '0' }}></div>

            <div
              className='page_content_wrap with_thumbs relative flex flex-col items-center'
              style={{ float: 'left' }}
            >
              <div className='page_content'>
                <h1 className='the_title !ml-0'>Khám phá Thiên Đường Chim Cảnh </h1>
                <p>
                  Tại Thiên Đường Chim Cảnh, chúng tôi tự hào là điểm đến đáng tin cậy cho những người yêu thú cưng và
                  đam mê chim cảnh. Với mục tiêu mang đến sự phục vụ tận tâm và chất lượng hàng đầu, chúng tôi cam kết
                  cung cấp những con chim cảnh chất lượng, khỏe mạnh và được chăm sóc đặc biệt.
                </p>
              </div>
              <div className='page_content'>
                <h1 className='the_title !ml-0'>Sản phẩm đa dạng </h1>
                <p>
                  Tại Thiên Đường Chim Cảnh, chúng tôi có một loạt các loại chim cảnh phong phú để bạn lựa chọn, từ
                  những con chim cảnh phổ biến cho đến các giống chim độc đáo và hiếm có.
                </p>
              </div>
              <Button
                style={{
                  border: '1px solid #4F4F4F'
                }}
                className='!bg-[#213F36] !shadow-button-shadow !w-[159px] !h-[75px] lg:!absolute lg:!top-[-150px] mt-5 lg:!left-1/3'
              >
                Mua Ngay
              </Button>
            </div>
          </div>
          <div id='intro' className='clearfix container  '>
            <img
              id='thumbnail'
              className='customer-hide !z-[101] !rounded-[10px] !absolute !object-cover'
              src='/landing-content-2.jpg'
            />
            <div
              className='custom-m page_content_wrap with_thumbs relative flex flex-col items-center'
              style={{ float: 'right' }}
            >
              <div className='page_content'>
                <h1 className='the_title xl:!ml-0'>
                  Đa dạng giống chim <br /> Tư vấn chuyên môn <br /> Chất lượng đảm bảo{' '}
                </h1>
                <p>
                  Dù bạn là một nhà nghiên cứu chim, một người yêu thú cưng hay một chủ nuôi chim đam mê, Dịch vụ Lai
                  Giống Chim Cảnh của chúng tôi sẽ mang lại cho bạn cơ hội thú vị để tạo ra những con chim cảnh độc đáo,
                  mang tính cá nhân và đặc biệt. Hãy cùng chúng tôi khám phá và trải nghiệm cuộc phiêu lưu lai giống
                  chim cảnh, mang đến sự độc đáo và sự đổi mới cho thế giới chim cảnh của bạn.
                </p>
              </div>

              <Button
                style={{
                  border: '1px solid #4F4F4F'
                }}
                className='!bg-[#213F36] !shadow-button-shadow !w-[159px] !h-[75px] lg:!absolute lg:!top-[-150px] mt-5 lg:!right-1/3'
              >
                Chọn giống chim
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
