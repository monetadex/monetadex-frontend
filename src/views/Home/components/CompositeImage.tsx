import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Box } from '@monetadex/uikit'

const floatingAnim = (x: string, y: string) => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(${x}, ${y});
  }
  to {
    transform: translate(0, 0px);
  }  
`

const Wrapper = styled(Box)<{ maxHeight: string }>`
  position: relative;
  max-height: ${({ maxHeight }) => maxHeight};

  & :nth-child(2) {
    animation: ${floatingAnim('3px', '15px')} 3s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${floatingAnim('5px', '10px')} 3s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${floatingAnim('6px', '5px')} 3s ease-in-out infinite;
    animation-delay: 0.33s;
  }

  & :nth-child(5) {
    animation: ${floatingAnim('4px', '12px')} 3s ease-in-out infinite;
    animation-delay: 0s;
  }
`

const DummyImg = styled.img<{ maxHeight: string }>`
  max-height: ${({ maxHeight }) => maxHeight};
  visibility: hidden;
`

const ImageWrapper = styled(Box)`
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  img {
    max-height: 100%;
    width: auto;
  }
`

enum Resolution {
  MD = '1.5x',
  LG = '2x',
}
interface ImageAttributes {
  src: string
  alt: string
}

export interface CompositeImageProps {
  path: string
  attributes: ImageAttributes[]
}

interface ComponentProps extends CompositeImageProps {
  animate?: boolean
  maxHeight?: string
}

export const getImageUrl = (base: string, imageSrc: string, resolution?: Resolution): string =>
  `${base}${imageSrc}${resolution ? `@${resolution}.png` : '.png'}`

export const getSrcSet = (base: string, imageSrc: string) => {
  return `${getImageUrl(base, imageSrc)} 512w, 
  ${getImageUrl(base, imageSrc, Resolution.MD)} 768w, 
  ${getImageUrl(base, imageSrc, Resolution.LG)} 1024w,`
}

const CompositeImage: React.FC<ComponentProps> = ({ path, attributes, maxHeight = '512px' }) => {
  return (
    <Wrapper maxHeight={maxHeight}>
      <DummyImg
        src={getImageUrl(path, attributes[0].src)}
        maxHeight={maxHeight}
        srcSet={getSrcSet(path, attributes[0].src)}
      />
      {attributes.map((image) => (
        <ImageWrapper key={image.src}>
          <img src={getImageUrl(path, image.src)} srcSet={getSrcSet(path, image.src)} alt={image.alt} />
        </ImageWrapper>
      ))}
    </Wrapper>
  )
}

export default CompositeImage
