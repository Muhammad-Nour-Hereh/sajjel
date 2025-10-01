import { Card, CardContent, CardHeader, CardTitle } from './card'

interface ImageCardProps {
  onClick: () => void
  title: string
  subTitle: string
  img: string
}

const ImageCard = ({ onClick, title, subTitle, img }: ImageCardProps) => {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={img} />
        <h1>{subTitle}</h1>
      </CardContent>
    </Card>
  )
}

export default ImageCard
