# sophie-bluel
Portfolio Website of Sophie Bluel

# Init the backend
```
cd Backend && npm start
```

## Ideas to discuss 

On hover on Send change the cursor type icon


# Dialog 

https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close 

It has the close method available , we can comment the buttom 

We can still have the x span but let's close it with

```javascript
closeButton.addEventListener("click", () => {
  dialog.close("animalNotChosen");
  openCheck(dialog);
});
```


Check later the categorys


# Make the login Page 
Integrate the Login Page for the Website