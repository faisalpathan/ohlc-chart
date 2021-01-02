import styled, { keyframes } from 'styled-components'


export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export const ChartWrapper = styled.div`
  height: calc(100vh - 30%);
  width: calc(100vw - 10%);
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 1px dashed #666666;
`

export const Tabs = styled.div`
  width: calc(100vw - 10%);
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: space-around;
  height: 60px;
  box-shadow: rgb(0, 0, 0) 0px 3px 6px -6px;
`

export const Tab = styled.section`
  border: none;
  background: none;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  width: 100%;
  transition: all 0.2s ease 0s;
  color: rgb(0, 120, 255);
  border-bottom: ${props => props.isActive ? '2px solid rgb(0, 120, 255)' : 'none'};
  cursor: pointer;
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`