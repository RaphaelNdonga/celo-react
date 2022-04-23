import React, {useState} from "react";
import PropTypes from "prop-types";
import {Button, Modal, Form, FloatingLabel} from "react-bootstrap";
import {uploadToIpfs} from "../../../utils/minter";
import Loader from "../../ui/Loader";

const AddNfts = ({save, address}) => {
    const [name, setName] = useState("");
    const [ipfsImage, setIpfsImage] = useState("");
    const [description, setDescription] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const isFormFilled = () => name && ipfsImage && description;

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);


    const uploadImage = async (e) => {

        try {
            setLoading(true)

            const imageUrl = await uploadToIpfs(e);
            if (!imageUrl) {
                alert("failed to upload image")
                return;
            }
            setIpfsImage(imageUrl);
        } catch (e) {
            console.log({e})
            alert("failed to upload image")
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <Button
                onClick={handleShow}
                variant="success"
                className="rounded-pill px-0 fs-4 fw-bold m-5"
                style={{width: "38px"}}
            >
                +
            </Button>
            {/* Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title> Create NFT</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <FloatingLabel
                            controlId="inputLocation"
                            label="Name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Name of NFT"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}/>
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputDescription"
                            label="Description"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="Description"
                                style={{height: "80px"}}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <Form.Control
                            type="file"
                            className={"mb-3"}
                            onChange={uploadImage}
                            placeholder="Product name"
                        ></Form.Control>
                        <Form.Label>
                            <h5>Properties</h5>
                        </Form.Label>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>

                    {loading ? <Loader/> :
                        <Button
                            variant="dark"
                            disabled={!isFormFilled()}
                            onClick={() => {
                                save({
                                    name,
                                    ipfsImage,
                                    description,
                                    ownerAddress: address
                                });
                                handleClose();
                            }}
                        >
                            Create NFT
                        </Button>

                    }

                </Modal.Footer>
            </Modal>
        </>
    )
}

AddNfts.propTypes = {
    save: PropTypes.func.isRequired,
    address: PropTypes.string.isRequired,
};

export default AddNfts;
