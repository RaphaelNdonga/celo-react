import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Row, Button } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useTraderContract, useMinterContract, useERC20Contract } from "../../../hooks";
import { acquireNft, sellNft } from "../../../utils/trader";
import traderAddress from "../../../contracts/NFTTrader-address.json"

const NftCard = ({ nft }) => {
    const { image, description, owner, name, index } = nft;
    const { address, performActions } = useContractKit();
    const traderContract = useTraderContract();
    const minterContract = useMinterContract();
    const erc20Contract = useERC20Contract();

    const [buttonState, setButtonState] = useState("");
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        let traderHasNFT = traderAddress.Address === owner;
        console.log("trader address is: ", traderAddress.Address);
        console.log("owner address is: ", owner);
        if (traderHasNFT) {
            setButtonState("Buy");
            setShowButton(true);
        }
        if (!traderHasNFT && address === owner) {
            setButtonState("Sell");
            setShowButton(true);
        }

        if (!traderHasNFT && address !== owner) {
            setShowButton(false);
        }
    }, [owner, address])

    return (
        <Col key={index}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <Identicon address={owner} size={28} />
                        <span className="font-monospace text-secondary">
                            {truncateAddress(owner)}
                        </span>
                        <Badge bg="secondary" className="ms-auto">
                            {index} ID
                        </Badge>
                    </Stack>
                </Card.Header>

                <div className=" ratio ratio-4x3">
                    <img src={image} alt={description} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{description}</Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-center">
                    <Button hidden={!showButton} onClick={async () => {
                        if (buttonState === "Sell") {
                            await acquireNft(minterContract, erc20Contract, traderContract, index, performActions);
                            window.location.reload();
                        }
                        if (buttonState === "Buy") {
                            console.log("in the button buy state")
                            await sellNft(traderContract, index, performActions);
                            window.location.reload();
                        }
                    }
                    }>
                        {buttonState}
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    );
};

NftCard.propTypes = {
    nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;