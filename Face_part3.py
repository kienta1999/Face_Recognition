import cv2
import numpy as np
import sys

recognizer =cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainner/trainner.yml')
cascadePath = "haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascadePath)
studentToID = {}
allId = set()

for i in range(1, len(sys.argv), 2):
    studentToID[sys.argv[i]] = sys.argv[i + 1]
cam = cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_SIMPLEX

while True:
    ret, im =cam.read()
    gray=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
    faces=faceCascade.detectMultiScale(gray, 1.2,5)
    for(x,y,w,h) in faces:
        cv2.rectangle(im,(x,y),(x+w,y+h),(225,0,0),2)
        Id, conf = recognizer.predict(gray[y:y+h,x:x+w])
        name = "Unknown"
        allId.add(Id)
        if(str(Id) in studentToID):
            name= studentToID[str(Id)]
        cv2.putText(im,str(name), (x,y+h),font, 0.8, (255,255,255), 1,cv2.LINE_AA)
    cv2.imshow('im',im)
    if cv2.waitKey(10) & 0xFF==ord('q'):
        break
for id in allId:
    print(id)
cam.release()
cv2.destroyAllWindows()