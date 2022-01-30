import React, { useEffect, useState } from "react";
import styled from "styled-components";
import imageUrlBuilder from "@sanity/image-url";
import { FaWallet } from "react-icons/fa";
import { client } from "../../lib/sanity";
import { TailSpin } from "react-loader-spinner";
const Transfer = ({
  selectedToken,
  setAction,
  thirdWebTokens,
  walletAddress,
}) => {
  const [amount, setamount] = useState("");
  const [recipient, setrecipient] = useState("");
  const [imageUrl, setimageUrl] = useState(null);
  const [activeThirdWebTokens, setactiveThirdWebTokens] = useState();
  const [balance, setBalance] = useState("Fetching....");
  useEffect(() => {
    const activeToken = thirdWebTokens.find(
      (token) => token.address === selectedToken.contractAddress
    );
    setactiveThirdWebTokens(activeToken);
    console.log(activeToken, "hahahah");
  }, []);
  useEffect(() => {
    console.log(selectedToken, "new");
    const url = imageUrlBuilder(client).image(selectedToken.logo).url();
    setimageUrl(url);
  }, [selectedToken, thirdWebTokens]);
  useEffect(() => {
    const getBalance = async () => {
      const balance = await activeThirdWebTokens.balanceOf(walletAddress);
      setBalance(balance.displayValue);
    };
    if (activeThirdWebTokens) {
      getBalance();
    }
  }, [activeThirdWebTokens]);
  const sendCrypto = async (amount, recipient) => {
    setAction("transferring");
    console.log("sending crypto....");
    if (activeThirdWebTokens && amount && recipient) {
      const tx = await activeThirdWebTokens.transfer(
        recipient,
        amount.toString().concat("000000000000000000")
      );
      console.log(tx);
      setAction("transferred");
    } else {
      console.error("Missing data");
    }
  };
  return (
    <Wrapper>
      <Amounts>
        <FlexInputContainer>
          <FlexInput
            placeholder="0"
            type="number"
            value={amount}
            onChange={(e) => setamount(e.target.value)}
          />
          <span>{selectedToken.symbol}</span>
        </FlexInputContainer>
        <Warning style={{ color: amount && "#0a0b0d" }}>
          *Amount is a required field!!
        </Warning>
      </Amounts>
      <TransferForm>
        <Row>
          <FeildName>To</FeildName>
          <Icon>
            <FaWallet />
          </Icon>
          <Recipient
            placeholder="Address"
            value={recipient}
            onChange={(e) => setrecipient(e.target.value)}
          />
        </Row>
        <Divider />
        <Row>
          <FeildName>Pay With </FeildName>

          <CoinSelectList onClick={() => setAction("select")}>
            <Icon>
              <img src={imageUrl} alt="" srcset="" />
            </Icon>
            <CoinName>{selectedToken.name}</CoinName>
          </CoinSelectList>
        </Row>
      </TransferForm>
      <Row>
        <Continue onClick={() => sendCrypto(amount, recipient)}>
          Continue
        </Continue>
      </Row>
      <Row>
        <BalanceTitle>{selectedToken.symbol} Balance</BalanceTitle>
        <Balance>
          {balance} {selectedToken.symbol}
        </Balance>
      </Row>
    </Wrapper>
  );
};

export default Transfer;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
`;
const Amounts = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
`;
const FlexInputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  & > span {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    color: #3773f5;
  }
`;
const FlexInput = styled.input`
  border: none;

  background: none;
  outline: none;
  color: white;
  font-size: 1.2 rem;
  text-wrap: wrap;
  text-align: right;
  max-width: 45%;
  margin-right: 1rem;
  font-size: 4.5rem;
  color: #3773f5;
  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const BalanceTitle = styled.div``;
const Balance = styled.div``;
const Warning = styled.div`
  padding: 1rem 0 2rem 0;
  text-align: center;
  color: #8a919;
`;
const Divider = styled.div`
  border-bottom: 1px solid #282b2f;
`;

const TransferForm = styled.div`
  border: 1px solid #282b2f;
  border-radius: 0.4rem;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #8a919e;
  padding: 1rem 0;
  font-size: 1.2 rem;
`;
const FeildName = styled.div`
  flex: 0.5;
  padding-left: 2rem;
`;
const Icon = styled.div`
  margin-right: 1rem;
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  & > img {
    height: 120%;
    width: 120%;
    object-fit: cover;
  }
`;
const Recipient = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  color: white;
  fonr-size: 1.2rem;
  text-wrap: warp;
  margin-right: 0.5rem;
`;
const CoinSelectList = styled.div`
  display: flex;
  flex: 1.3;
  height: 100%;
  &:hover {
    cursor: pointer;
  }
`;
const CoinName = styled.div`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  color: white;
  font-size: 1.2rem;
  text-wrap: wrap;
  margin-right: 0.5rem;
`;
const Continue = styled.button`
  color: white;
  width: 100%;
  background-color: #3773f5;
  padding: 1rem;
  text-align: center;
  border-radius: 0.4rem;
  font-size: 1.2rem;
  &:hover {
    cursor: pointer;
    background-color: #4a80f6;
  }
`;
