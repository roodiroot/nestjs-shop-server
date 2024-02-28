import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file): Promise<any> {
    try {
      const logoName = await this.changeFile(file.logo, 'prod');
      const imgesArray = await this.changeFile(file.imges, 'prod');
      return { logoName: logoName.toString(), imgesArray };
    } catch (error) {
      throw new HttpException(
        'Произошла ошибка при записи',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async changeFile(file: any, folder: string) {
    try {
      //Проверка наличия всех папок на пути и создание если таковых нет
      const filePath = path.resolve(__dirname, '..', '..', 'static', folder);
      console.log(filePath);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      // создание массива куда будет собираться названия файлов
      let arrayNames = [];
      // изменение размеров и формата изображения
      for (let i = 0; i < file.length; i++) {
        const fileName = uuid.v4();
        await sharp(file[i].buffer)
          .resize({ width: 600 })
          .toFormat('png')
          .toFile(path.resolve(filePath, `${fileName}.png`))
          .then((e) => {
            sharp(file[i].buffer)
              .resize({ width: 200 })
              .toFormat('png')
              .toFile(path.resolve(filePath, `${fileName}.min.png`))
              .then((e) => {
                sharp(file[i].buffer)
                  .resize({ width: 600 })
                  .toFormat('webp')
                  .toFile(path.resolve(filePath, `${fileName}.webp`))
                  .then((e) => {
                    sharp(file[i].buffer)
                      .resize({ width: 200 })
                      .toFormat('webp')
                      .toFile(path.resolve(filePath, `${fileName}.min.webp`))
                      .then((e) => {
                        console.log('успешно');
                      });
                  });
              });
          });

        arrayNames.push(fileName);
      }
      return arrayNames;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Произошла ошибка конвертации',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
