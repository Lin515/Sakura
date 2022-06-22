# coding=utf-8
'''
Created on Apr 23, 2018
Desc: Webp convertor
@author: Mashiro https://2heng.xin
@modifier: LinGe https://lin515.com
'''
import os
import sys
import json
import hashlib
from PIL import Image

class Single(object):
  def __init__(self, file, manifest, quality, size):
    self.file = file
    self.mani = manifest
    self.quality = quality
    self.size = size

  def hash(self):
    hasher = hashlib.md5()
    with open('gallary/' + self.file, 'rb') as afile:
      buf = afile.read()
      hasher.update(buf)
    self.hash = hasher.hexdigest()
    self.jpeg = 'jpeg/' + self.hash + '.jpeg'
    self.webp = 'webp/' + self.hash + '.webp'
    # self.jpeg_th = 'jpeg/' + self.hash + '.th.jpeg'
    # self.webp_th = 'webp/' + self.hash + '.th.webp'

  def optimize(self):
    im = Image.open('gallary/' + self.file).convert('RGB')
    im.save(self.webp, 'WEBP', quality=self.quality)
    if self.size > 0 : # 压缩到比限制大小刚好小一点点的值
      while os.stat(self.webp).st_size > self.size :
        self.quality -= 1
        if self.quality < 0 :
          break
        im.save(self.webp, 'WEBP', quality=self.quality)
    im.save(self.jpeg, 'JPEG', quality=self.quality) # todo: TinyPNG API
    # im.thumbnail((450, 300))
    # im.save(self.jpeg_th, 'JPEG')  # todo: TinyPNG API
    # im.save(self.webp_th, 'WEBP')

  def manifest(self):
    self.mani[self.hash] = {
      'source': self.file,
      # 'jpeg': [self.jpeg, self.jpeg_th],
      # 'webp': [self.webp, self.webp_th]
      'jpeg': self.jpeg,
      'webp': self.webp
    }

  def main(self):
    self.hash()
    # if os.path.exists(self.jpeg) and os.path.exists(self.webp):
    self.optimize()
    self.manifest()
    return self.mani

def gen_manifest_json(quality, size):
  onlyfiles = [f for f in os.listdir('gallary') if os.path.isfile(os.path.join('gallary', f))]
  id = 1
  Manifest = {}
  for f in onlyfiles:
    try:
      worker = Single(f, Manifest, quality, size)
      Manifest = worker.main()
      print(str(id) + '/' + str(len(onlyfiles)))
      id += 1
    except OSError:
      print("Falied to optimize the picture: " + f)
  with open('manifest.json', 'w+') as json_file:
    json.dump(Manifest, json_file)


def main():
  quality = int(input('请输入图片压缩率(0-95, 默认:75):'))
  if quality < 0 and quality > 95 :
    quality = 75
  size = int(input('请输入图片最大大小（以webp图为准）。按照给定压缩率压缩后，若图片大小大于该值，则将继续缩小压缩率，以将图片压缩到刚好小于限制大小。若输入0则不限制(单位:KB):'))
  if size < 0:
    size = 0
  gen_manifest_json(quality, size*1024)


if __name__ == '__main__':
  main()
  key = input('`manifest.json` saved. Press any key to quit.')
  quit()
