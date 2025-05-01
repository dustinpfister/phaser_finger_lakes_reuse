

```js
      
    offTileCheck (map, layer = 0) {
        const sprite = this;
        const tx = ( sprite.x - 8 ) / 16;
        const ty = ( sprite.y - 8 ) / 16;
        const TX = Math.floor(tx);
        const TY = Math.floor(ty);
        let t = sprite.getData('idleTime');
        t += 1;
        if( t >= 50){
            t = 0;
            const t4 = map.getTileAt(TX, TY, true, layer);
            const t5 = map.getTileAt(TX + 1, TY, true, layer);
            const t7 = map.getTileAt(TX, TY + 1, true, layer);
            const fx = tx - Math.floor(tx);
            const fy = ty - Math.floor(ty);
            if( fx < 0.50 && t4.index === 1 ){ sprite.x = t4.x * 16 + 8; }
            if( fx >= 0.50 && t5.index === 1 ){ sprite.x = t5.x * 16 + 8; }
            if( fy < 0.50 && t4.index === 1 ){ sprite.y = t4.y * 16 + 8; }
            if( fy >= 0.50 && t7.index === 1 ){ sprite.y = t7.y * 16 + 8; }
        }
        sprite.setData('idleTime', t);
    }
```

```js
    pathProcessor1 (scene, v=80, min_d=0.1) {
        let path = this.getData('path');
        if(path.length > 0){
            this.x = path[0].x * 16 + 8;
            this.y = path[0].y * 16 + 8;
            path = path.slice(1, path.length);   
            this.setData('path', path );
        }
        if(path.length === 0){
            this.setVelocity(0);
        }
    }
   
    pathProcessor2 (scene, map, v=100, min_d=0.1) {
        let path = this.getData('path');
        
        this.setVelocity(0);
        if(path.length > 0){
            const pos = path[0];
            const px = Math.floor(this.x) / 16;
            const py = Math.floor(this.y) / 16;
            const tx = pos.x + 0.50;
            const ty = pos.y + 0.50;
            const d = Phaser.Math.Distance.Between(tx, ty, px, py);    
            //const a = Math.atan2(pos.y - Math.floor(py), pos.x - Math.floor(px));
            const a = Math.atan2(ty - py, tx - px);
            let c = Math.cos(a);
            let s = Math.sin(a);
            let vx = 0;
            let vy = 0;
            const deg = Math.round(a / Math.PI * 360);
            if( Math.abs(deg) > 140 && Math.abs(deg) <= 220){
                vy = s * v;
                this.setVelocityY( vy );
            }
            if(deg === 0 || deg === 360){
                vx = c * v;
                this.setVelocityX( vx );
            }
            if(d <= min_d){
                path = path.slice(1, path.length);   
                this.setData('path', path );
                this.x = pos.x * 16 + 8;
                this.y = pos.y * 16 + 8;       
            }
        }
        if(path.length === 0){ 
            this.offTileCheck(map);
        }
    }
    
    pathProcessor3 (scene, map, v=100, min_d=0.1) {
        let path = this.getData('path');
        
        this.setVelocity(0);
        if(path.length > 0){
            const pos = path[0];
            const px = Math.floor(this.x) / 16;
            const py = Math.floor(this.y) / 16;
            const tx = pos.x + 0.50;
            const ty = pos.y + 0.50;
            const d = Phaser.Math.Distance.Between(tx, ty, px, py);
            
            if(d > min_d){
               let vx = 0, vy = 0;
               if(tx > px){ vx = v; }
               if(tx < px){ vx = v * -1; }
               if(ty > py){ vy = v; }
               if(ty < py){ vy = v * -1; }
               this.setVelocityX(vx);
               this.setVelocityY(vy);
                       
            }
            
            if(d <= min_d){
                this.x = path[0].x * 16 + 8;
                this.y = path[0].y * 16 + 8; 
                path = path.slice(1, path.length);   
                this.setData('path', path );
                      
            }
        }
        if(path.length === 0){ 
            //this.offTileCheck(map);
        }
    }
    
    pathProcessor4 (scene, map, v=100, min_d=0.1) {
        let path = this.getData('path');
        let mf = this.getData('moveFrame');
        if(mf === 0){
            this.setData('sp', this.getTilePos() );
        }
        const sp = this.getData('sp');
        const px = this.x / 16, py = this.y / 16;
        const d = Phaser.Math.Distance.Between(sp.x + 0.5, sp.y + 0.5, px, py);
        if(path.length > 0){
            const dx = 16;
            const dy = 0;
            this.x = (sp.x * 16 + 8) + mf * ( dx / 10);
            this.y = (sp.y * 16 + 8) + mf * ( dy / 10);
            mf += 1;
            this.setData('moveFrame', mf);
            if(mf >= 10){
                path = path.slice(1, path.length);   
                this.setData('path', path );
                this.setData('moveFrame', 0);
            }
        }
        if(path.length === 0){ 
            this.offTileCheck(map);
            this.setData('moveFrame', 0);
        }
    }
```
