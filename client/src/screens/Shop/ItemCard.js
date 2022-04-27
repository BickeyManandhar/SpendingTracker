import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Box, Chip, Divider, Rating } from '@mui/material'

export default function ItemCard({
  reviews,
  title,
  rating,
  thumbnail,
  price,
  tag,
  extensions,
  delivery,
  source,
}) {
  return (
    <Card sx={{ border: '1px solid' }}>
      <Box p={1} mt={!tag && 4}>
        {tag && <Chip label={tag} size="small" variant="outlined" />}
      </Box>
      <CardMedia component="img" height="200" image={thumbnail} alt={title} />
      <CardContent>
        <Box minHeight={'120px'}>
          <Typography fontSize={'17px'}>{title}</Typography>
          <Box display={'flex'}>
            <Typography>{rating}</Typography>
            <Rating
              size="small"
              name="half-rating"
              defaultValue={rating}
              precision={0.5}
            />
            <Typography>{reviews}</Typography>
          </Box>
          <Box display={'flex'}>
            {extensions?.map((item, index) => {
              return (
                <Typography fontSize={'14px'} key={index} color={'gray'}>
                  {item}
                  {' .'}{' '}
                </Typography>
              )
            })}
          </Box>
        </Box>

        <Box my={3}>
          <Divider />
        </Box>
        <Typography fontWeight={'bold'}>{price}</Typography>
        <Typography fontSize={'14px'}>{source}</Typography>
        <Typography fontSize={'14px'}>{delivery}</Typography>
        <Typography fontSize={'14px'}>{'Trusted Store'}</Typography>
      </CardContent>
    </Card>
  )
}
