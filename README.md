# Introduction

Random Training is a very basic single page application forked from [this](https://github.com/diracdeltas/random-training) repository.

## Changes from the orignial

My repo removed some of the unused code dealing with recipies, and also the integration to soundcloud. It also paired down some of the code to increase readablitlty and changed the background images for gifs that make it easeir to folow the exercises.

The one other major change is I am assuming you have access to a set of dumbbells when doing the exercises.

## Creating your own Random Work website

Creating and hosting your own random workout website is faily easy.

### How to host

In order to host an exact copy of this site follow these instructions:

1. Fork this repository

1. In your repo navigate to `Settings`->`Pages`

1. Under `Soruce` select branch `main` and the `root` directory

1. Finished! You should be able to see your application being build and deployed under the `Actions` tab

### How to Modify the code 

In order to add your own exercises to this application navigate to the `index.js` file. 

Then add/remove exercises from the "exercise" const at the top. Note that `exercises` is a list of list of exercises. Each of the different list is considered an "exercise type" which the application will move through sequentially (i.e. in my repo you start with legs then biceps/triceps then abs). When inside that exercise type the app will chose a random exercise from that list. The exercise itself consis of 3 parts, an `exerciseName`, a `minimumTime` to do the exercise, and a `maximumTime`. 

This pattern can be pretty easily followed. If you want to include images assoicated with your exercise you will need to first make a change on line 116, so that the `background` function points to your repository and not mine. Then simply add an image with the name of your exercise(without the spaces) as a `gif` into the `img` folder. 