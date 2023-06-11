# Foundry Course Mint Bot

A fun project developed to monitor and celebrate NFT minting on the Arbitrum network.

This project is made up of two main parts:

- **[Frontend Tracker](https://foundry-mints.vercel.app/)** - A web application that listens for contract events in real-time and displays the latest mints.
- **[Twitter Bot](https://twitter.com/foundrymintbot)** - A bot that tweets congratulations to a user's Twitter handle when they mint an NFT.

## Project Overview

The project was inspired by a [task](https://github.com/Cyfrin/foundry-full-course-f23/issues/13) proposed by PatrickAlphaC. The task was to create a Twitter bot that congratulates people when they mint an NFT on the Arbitrum network, with the addition of a website that shows a real-time list of people minting.

The contract we are listening for events from can be found [here](https://arbiscan.io/address/0x39338138414Df90EC67dC2EE046ab78BcD4F56D9#code).

## Implementation Details

The Frontend Tracker is built using React and listens for 'ChallengeSolved' events from a specified smart contract. The application displays the address of the solver, the challenge they solved, and their Twitter handle (if available). 

The Twitter Bot is created using Node.js and communicates with the Twitter API to post a congratulatory message whenever a user mints a new NFT and provides their Twitter handle.

![Frontend Tracker](https://github.com/Cyfrin/foundry-full-course-f23/assets/12901349/84ee315a-98a7-45ec-b35f-ca16bf7b5154)

![Twitter Bot](https://github.com/Cyfrin/foundry-full-course-f23/assets/12901349/371c66be-09dd-489c-9def-e81da83a1852)

## Contribute

Feel free to fork this repository, submit issues, or pull requests if you want to contribute or suggest any improvements. 

## License

[MIT]([LICENSE](https://en.wikipedia.org/wiki/MIT_License))
