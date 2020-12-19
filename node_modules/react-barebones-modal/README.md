## Description

A simple react package that is a barebones out of the box modal.

## Usage

```sh
const [showModal, setShowModal] = useState(false);
const modalClickHandler = e => console.log(e);

<Modal
  customClassName={`w80% mawa bgc-t t50 posa ofh`}
  show={showModal}
  childClickHandler={modalClickHandler} // not required
  handleClose={() => setShowModal(false)}>
    <h1> Hi! </hi>
    <div onClick={}> Close Me </div>
</Modal>
```

![npm](https://img.shields.io/npm/v/@npmpackageschicago/react-barebones-modal?style=for-the-badge)

![npm bundle size](https://img.shields.io/bundlephobia/min/@npmpackageschicago/react-barebones-modal?style=for-the-badge)